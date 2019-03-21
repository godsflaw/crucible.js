'use strict';

import Web3 from 'web3';
import { Provider } from 'web3/providers';

import { Assertions } from './assertions';
import { libCrucibleErrors } from './errors';
import { FoundryAPI, CrucibleAPI } from './api';
import { Address, Commitment, TransactionReceipt, Tx } from './types/common';
import {
  awaitTx,
  BigNumber,
  goalStateToString,
  instantiateWeb3
} from './util';

export interface LibCrucibleConfig {
  foundryAddress: Address;
}

/**
 * @title LibCrucible
 * @author Christopher Mooney
 *
 * The LibCrucible class that exposes all functionality for interacting with
 * Crucible smart contracts.  Methods that require interaction with the
 * Ethereum blockchain are exposed after instantiating a new instance
 * of Crucible with the web3 provider argument.
 */
class LibCrucible {
  private web3: Web3;
  private assertions: Assertions;
  private foundry: FoundryAPI;
  private crucible: CrucibleAPI;

  /**
   * An instance of the ListingAPI class containing methods for listing a
   * crucible.
   */
  // public listings: ListingAPI;

    /**
   * Instantiates a new Crucible instance that provides the public interface
   * to the Crucible.js library
   *
   * @param provider         Provider instance you would like the Crucible.js
   *                         library to use for interacting with the Ethereum
   *                         network
   * @param config           Configuration object conforming to CrucibleConfig
   *                         with the foundry's proxy address
   */
  constructor(provider: Provider, config: LibCrucibleConfig) {
    this.web3 = instantiateWeb3(provider);
    this.assertions = new Assertions(this.web3);
    this.foundry = new FoundryAPI(
      this.web3, config.foundryAddress, this.assertions
    );
    // TODO(godsflaw): implement backend for listing Crucibles
    // this.listings = new ListingAPI(this.web3, this.foundry);
  }

  /*
   * METHODS ON THE FOUNDRY
   */

  /**
   * Creates a new Crucible
   *
   * The return value is a transaction hash rather than the deployed crucible
   * or address to it.  This is because transactions on ethereum can be highly
   * async.  If you want the fully instantiated crucible then call
   * loadCrucibleFromCreateTxHash() after this.
   *
   * @param  validator       Address of validator/oracle/owner
   * @param  beneficiary     Address of the beneficiary.  This can just be the
   *                         empty address for pooled penalty behavior, but if
   *                         you want all penalties, less the fee, to go to one
   *                         address, this is what you would use.
   * @param  startDate       Usually the epoch timestamp (seconds) when the
   *                         Crucible was created.
   * @param  lockDate        The epoch timestamp (seconds) when the Crucible is
   *                         no longer taking new participants, and the point
   *                         when the Crucible begins.  This date allows one
   *                         to change the Crucible state to LOCKED.
   * @param  endDate         The epoch timestamp (seconds) when the Crucible is
   *                         finished.  This date allows one to change the
   *                         Crucible state to JUDGEMENT.
   * @param  minAmountWei    The minimum commitment amount in Wei.  This must be
   *                         greater than 0, and is suggested to be greater than
   *                         gasCost for the different contract interfaces.
   * @param  timeout         The number of seconds, when added to endDate, that
   *                         allows one to change the Crucible state to BROKEN.
   * @param  feeNumerator    The parts in a 1000 that the validator/oracle/owner
   *                         takes as a fee.  e.g. 0/1000 = 0%, 10/1000 = 1%,
   *                         500/1000 = 50%, and 1000/1000 = 100%. The default
   *                         is 100, so 100/1000 = 10%.
   * @param  txOpts          Transaction options object conforming to `Tx` with
   *                         signer, gas, and gasPrice data
   * @return                 Transaction hash
   */
  public async createCrucible(
    validator: Address,
    beneficiary: Address,
    startDate: BigNumber,
    lockDate: BigNumber,
    endDate: BigNumber,
    minAmountWei: BigNumber,
    timeout: BigNumber,
    feeNumerator: BigNumber,
    txOpts: Tx
  ): Promise<string> {
    return await this.foundry.createCrucible(
      validator,
      beneficiary,
      startDate,
      lockDate,
      endDate,
      minAmountWei,
      timeout,
      feeNumerator,
      txOpts
    );
  }

  /**
   * get the number of crucibles tracked by the foundry
   *
   * @return                  The number of crucibles tracked by the foundry
   */
  public async getCrucibleCount(): Promise<BigNumber> {
    return await this.foundry.getCount();
  }

  /**
   * loads a crucible from the transaction hash passed back from createCrucibe()
   *
   * @param  txHash           the transaction hash from createCrucible()
   * @return                  void (throws on error)
   */
  public async loadCrucibleFromCreateTxHash(txHash: string) {
    const receipt: TransactionReceipt = await this.getTxReceipt(txHash);
    const crucibleAddress = await this.foundry.getCrucibleAddressFromReceipt(
      receipt
    );

    this.loadCrucibleFromAddress(crucibleAddress);
  }

  /**
   * loads a crucible from an address
   *
   * @param  crucibleAddress  address of the crucible contract to load
   * @return                  void (throws on error)
   */
  public async loadCrucibleFromAddress(crucibleAddress: Address) {
    this.crucible = new CrucibleAPI(
      this.web3, crucibleAddress, this.assertions
    );
  }

  /**
   * loads a crucible from an index
   *
   * @param  index            index of the crucible address
   * @return                  void (throws on error)
   */
  public async loadCrucibleFromIndex(index: BigNumber) {
    const crucibleAddress = await this.foundry.getCrucibleAddressFromIndex(
      index
    );

    this.crucible = new CrucibleAPI(
      this.web3, crucibleAddress, this.assertions
    );
  }

  /**
   * removes the listing of a crucible from the foundry
   *
   * @param  crucibleAddress  the crucible address to remove from the foundry
   * @param  txOpts           Transaction options object conforming to `Tx` with
   *                          signer, gas, and gasPrice data
   * @return                  Transaction hash
   */
  private async deleteCrucibleFromFoundry(
    crucibleAddress: Address,
    txOpts: Tx
  ): Promise<string> {
    return await this.foundry.deleteCrucible(crucibleAddress, txOpts);
  }

  /*
   * METHODS THAT WORK ON A CRUCIBLE
   */

  /**
   * Used to add a commitment to the loaded crucible with a given participant
   * and amount.
   *
   * @param  participantAddress   the address of the participant
   * @param  txOpts               Transaction options object conforming to
   *                              `Tx` with signer, gas, and gasPrice data
   * @return                      Transaction hash
   */
  private async addCommitment(
    participantAddress: Address,
    txOpts: Tx
  ): Promise<string> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    return await this.crucible.addCommitment(participantAddress, txOpts);
  }

  /**
   * Used to indicate of a participant has met a goal or not.
   *
   * @param  participantAddress   the address of the participant
   * @param  metGoal              boolean true = met goal, false = not met goal
   * @param  txOpts               Transaction options object conforming to
   *                              `Tx` with signer, gas, and gasPrice data
   * @return                      Transaction hash
   */
  private async setGoal(
    participantAddress: Address,
    metGoal: boolean,
    txOpts: Tx
  ): Promise<string> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    return await this.crucible.setGoal(participantAddress, metGoal, txOpts);
  }

  /**
   * Used to lock the crucible.  This action prevents more commitments
   * from being added, and usually indicates the active period of the crucuble.
   *
   * @param  txOpts               Transaction options object conforming to
   *                              `Tx` with signer, gas, and gasPrice data
   * @return                      Transaction hash
   */
  private async lock(txOpts: Tx): Promise<string> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    return await this.crucible.lock(txOpts);
  }

  /**
   * Used to put the crucible into the JUDGEMENT state.  This action is done
   * to allow the oracle a period of time to setGoal before moving to the
   * FINISHED state where payouts can occur.
   *
   * @param  txOpts               Transaction options object conforming to
   *                              `Tx` with signer, gas, and gasPrice data
   * @return                      Transaction hash
   */
  private async judgement(txOpts: Tx): Promise<string> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    return await this.crucible.judgement(txOpts);
  }

  /**
   * check to see of a participant exists
   *
   * @param  participantAddress   the address of the participant
   * @return                      true if participant exists, false otherwise
   */
  public async participantExists(
    participantAddress: Address
  ): Promise<boolean> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    return await this.crucible.participantExists(participantAddress);
  }

  /**
   * get the current crucible state
   *
   * @return                      the current state
   */
  public async getState(): Promise<string> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    return await this.crucible.getState();
  }

  /**
   * get the number of participants/commitments in this crucible
   *
   * @return                  Number of commitments in crucible
   */
  public async getCommitmentCount(): Promise<BigNumber> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    return await this.crucible.getCommitmentCount();
  }

  /**
   * Gets the commitment of a participant.
   *
   * @param  participantAddress the address of the participan
   * @return                    Commitment of the given participant
   */
  public async getCommitment(participantAddress: Address): Promise<Commitment> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    return await this.crucible.getCommitment(participantAddress);
  }

  /**
   * Gets the goal state for the participant.
   *
   * @param  participantAddress the address of the participan
   * @return                    goal state of a participant
   */
  public async getGoalState(participantAddress: Address): Promise<string> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    let commitment = await this.getCommitment(participantAddress);

    return goalStateToString(commitment.metGoal);
  }

  /**
   * Gets the commitment amount for the participant.
   *
   * @param  participantAddress the address of the participan
   * @return                    goal state of a participant
   */
  public async getCommitAmount(participantAddress: Address): Promise<BigNumber> {
    if (this.crucible === undefined) {
      throw new Error(libCrucibleErrors.CRUCIBLE_UNDEFINED());
    }

    let commitment = await this.getCommitment(participantAddress);

    return commitment.amount;
  }

  /*
   * UTILITY METHODS
   */

  /**
   * wait for and get the TransactionReceipt and return it given the txHash.
   *
   * @param  txHash           the transaction hash
   * @return                  TransactionReceipt from given txHash
   */
  public async getTxReceipt(txHash: string): Promise<TransactionReceipt> {
    return await awaitTx(this.web3, txHash);
  }

  /**
   * wait for the given txHash to complete (be mined)
   *
   * @param  txHash           the transaction hash
   * @return                  void (throws on error)
   */
  public async waitForTxToComplete(txHash: string) {
    await this.getTxReceipt(txHash);
  }

}

export default LibCrucible;
