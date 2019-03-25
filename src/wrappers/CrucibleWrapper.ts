'use strict';

import Web3 from 'web3';

import { ContractWrapper } from '.';
import { TransactionReceipt } from 'ethereum-types';
import { NULL_ADDRESS } from '../constants';
import { Address, Tx } from '../types/common';
import { BigNumber, generateTxOpts } from '../util';

/**
 * @title  CrucibleWrapper
 * @author Christopher Mooney
 *
 * The CrucibleWrapper handles all functions on the Foundry smart contract.
 *
 */
export class CrucibleWrapper {
  private web3: Web3;
  private contracts: ContractWrapper;

  public constructor(web3: Web3) {
    this.web3 = web3;
    this.contracts = new ContractWrapper(this.web3);
  }

  /**
   * Add a participant to a crucible
   *
   * @param  crucibleAddress    The address of the crucible contract
   * @param  participantAddress The address of the participant to add
   * @param  txOpts             Transaction options object conforming to `Tx`
   *                            with signer, gas, gasPrice, and -- most
   *                            importantly for this case -- value data
   * @return                    The hash of the resulting transaction.
   */
  public async add(
    crucibleAddress: Address,
    participantAddress: Address,
    txOpts: Tx
  ): Promise<string> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await crucibleInstance.add.sendTransactionAsync(
      participantAddress,
      txOptions
    );
  }

  /**
   * Set the goal as met or not for a given participant.
   *
   * @param  crucibleAddress    The address of the crucible contract
   * @param  participantAddress The address of the participant to setGoal for
   * @param  metGoal            boolean true = met goal, false = not met goal
   * @param  txOpts             Transaction options object conforming to `Tx`
   *                            with signer, gas, gasPrice, and value data
   * @return                    The hash of the resulting transaction.
   */
  public async setGoal(
    crucibleAddress: Address,
    participantAddress: Address,
    metGoal: boolean,
    txOpts: Tx
  ): Promise<string> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await crucibleInstance.setGoal.sendTransactionAsync(
      participantAddress,
      metGoal,
      txOptions
    );
  }

  /**
   * Collect the fee and payout beneficiary
   *
   * @param  crucibleAddress    The address of the crucible contract
   * @param  destinationAddress The address to send the fee to
   * @param  txOpts             Transaction options object conforming to `Tx`
   *                            with signer, gas, gasPrice, and value data
   * @return                    The hash of the resulting transaction.
   */
  public async collectFee(
    crucibleAddress: Address,
    destinationAddress: Address,
    txOpts: Tx
  ): Promise<string> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await crucibleInstance.collectFee.sendTransactionAsync(
      destinationAddress,
      txOptions
    );
  }

  /**
   * Gets the number of participants/commitments in this crucible
   *
   * @param  crucibleAddress      The address of the crucible contract
   * @return                      Number of commitments in crucible
   */
  public async getCommitmentCount(crucibleAddress: Address): Promise<BigNumber> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);

    return await crucibleInstance.count.callAsync();
  }

  /**
   * Gets the number of participants/commitments in this crucible
   *
   * @param  crucibleAddress      The address of the crucible contract
   * @param  participantAddress   the address of the participant
   * @return                      Array of commitment values
   */
  public async commitments(
    crucibleAddress: Address,
    participantAddress: Address
  ): Promise<[boolean, BigNumber, BigNumber]> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);

    return await crucibleInstance.commitments.callAsync(participantAddress);
  }

  /**
   * Gets the number of participants/commitments in this crucible
   *
   * @param  crucibleAddress      The address of the crucible contract
   * @param  participantAddress   the address of the participant
   * @return                      true if participant exists, false otherwise
   */
  public async participantExists(
    crucibleAddress: Address,
    participantAddress: Address
  ): Promise<boolean> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);

    return await crucibleInstance.participantExists.callAsync(
      participantAddress
    );
  }

  /**
   * Gets the current state of the crucible contract
   *
   * @param  crucibleAddress      The address of the crucible contract
   * @return                      the current state
   */
  public async state(crucibleAddress: Address): Promise<BigNumber> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);

    return await crucibleInstance.state.callAsync();
  }

  /**
   * lock the crucible
   *
   * @param  crucibleAddress    The address of the crucible contract
   * @param  txOpts             Transaction options object conforming to `Tx`
   *                            with signer, gas, gasPrice, and value data
   * @return                    The hash of the resulting transaction.
   */
  public async lock(crucibleAddress: Address, txOpts: Tx): Promise<string> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await crucibleInstance.lock.sendTransactionAsync(txOptions);
  }

  /**
   * move crucible into the judgement state
   *
   * @param  crucibleAddress    The address of the crucible contract
   * @param  txOpts             Transaction options object conforming to `Tx`
   *                            with signer, gas, gasPrice, and value data
   * @return                    The hash of the resulting transaction.
   */
  public async judgement(crucibleAddress: Address, txOpts: Tx): Promise<string> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await crucibleInstance.judgement.sendTransactionAsync(txOptions);
  }

  /**
   * move crucible into the finished state
   *
   * @param  crucibleAddress    The address of the crucible contract
   * @param  txOpts             Transaction options object conforming to `Tx`
   *                            with signer, gas, gasPrice, and value data
   * @return                    The hash of the resulting transaction.
   */
  public async finish(crucibleAddress: Address, txOpts: Tx): Promise<string> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await crucibleInstance.finish.sendTransactionAsync(txOptions);
  }

  /**
   * move crucible into the paid state
   *
   * @param  crucibleAddress    The address of the crucible contract
   * @param  txOpts             Transaction options object conforming to `Tx`
   *                            with signer, gas, gasPrice, and value data
   * @return                    The hash of the resulting transaction.
   */
  public async paid(crucibleAddress: Address, txOpts: Tx): Promise<string> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await crucibleInstance.paid.sendTransactionAsync(txOptions);
  }

  /**
   * move crucible into the broken state
   *
   * @param  crucibleAddress    The address of the crucible contract
   * @param  txOpts             Transaction options object conforming to `Tx`
   *                            with signer, gas, gasPrice, and value data
   * @return                    The hash of the resulting transaction.
   */
  public async broken(crucibleAddress: Address, txOpts: Tx): Promise<string> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await crucibleInstance.broken.sendTransactionAsync(txOptions);
  }
}
