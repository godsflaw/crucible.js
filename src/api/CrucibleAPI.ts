'use strict';

import * as _ from 'lodash';
import Web3 from 'web3';

import { Assertions } from '../assertions';
import { libCrucibleErrors } from '../errors';
import { CrucibleWrapper } from '../wrappers';
import { TransactionReceipt } from 'ethereum-types';
import { Address, Commitment, Tx, CrucibleState } from '../types/common';
import {
  awaitTx,
  BigNumber,
  crucibleNumberToGoal,
  crucibleNumberToState,
  crucibleStateToString,
  goalStateToString
} from '../util';

/**
 * @title CrucibleAPI
 * @author Christopher Mooney
 *
 * A library for interacting with the crucible smart contract.  This interface
 * allows for interaction with a particular crucible.
 */
export class CrucibleAPI {
  public address: Address;
  private assert: Assertions;
  private crucibleWrapper: CrucibleWrapper;
  private web3: Web3;

  /**
   * Instantiates a new CrucibleAPI instance that contains methods for
   * interacting with a specific Crucible.
   *
   * @param web3            Web3.js Provider instance you would like the
   *                        crucible.js library to use for interacting with the
   *                        Ethereum network
   * @param crucibleAddress the address of the crucible contract on the network
   * @param assertions      An instance of the Assertion library
   */
  constructor(web3: Web3, crucibleAddress: Address, assertions: Assertions) {
    this.web3 = web3;
    this.assert = assertions;
    this.address = crucibleAddress;
    this.crucibleWrapper = new CrucibleWrapper(web3);
  }

  /**
   * Used to add a commitment to the loaded crucible with a given participant
   * and amount.
   *
   * @param  participantAddress   the address of the participant
   * @param  txOpts               Transaction options object conforming to
   *                              `Tx` with signer, gas, and gasPrice data
   * @return                      Transaction hash
   */
  public async addCommitment(
    participantAddress: Address,
    txOpts: Tx
  ): Promise<string> {
    await this.assertAddCommitment(
      CrucibleState.OPEN, participantAddress, txOpts
    );

    return await this.crucibleWrapper.add(
      this.address, participantAddress, txOpts
    );
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
  public async setGoal(
    participantAddress: Address,
    metGoal: boolean,
    txOpts: Tx
  ): Promise<string> {
    await this.assertSetGoal(
      [CrucibleState.LOCKED, CrucibleState.JUDGEMENT],
      participantAddress,
      txOpts
    );

    return await this.crucibleWrapper.setGoal(
      this.address, participantAddress, metGoal, txOpts
    );
  }

  /**
   * Used to lock the crucible.  This action prevents more commitments
   * from being added, and usually indicates the active period of the crucuble.
   *
   * @param  txOpts               Transaction options object conforming to
   *                              `Tx` with signer, gas, and gasPrice data
   * @return                      Transaction hash
   */
  public async lock(txOpts: Tx): Promise<string> {
    await this.assertCanLockState(CrucibleState.OPEN, txOpts);

    return await this.crucibleWrapper.lock(this.address, txOpts);
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
  public async judgement(txOpts: Tx): Promise<string> {
    await this.assertCanJudgementState(CrucibleState.LOCKED, txOpts);

    return await this.crucibleWrapper.judgement(this.address, txOpts);
  }

  /**
   * Gets the number of participants/commitments in this crucible
   *
   * @return                 Number of commitments in crucible
   */
  public async getCommitmentCount(): Promise<BigNumber> {
    return await this.crucibleWrapper.getCommitmentCount(this.address);
  }

  /**
   * Gets the commitment of a participant.
   *
   * @param  participantAddress   the address of the participant
   * @return                      Commitment of the given participant
   */
  public async getCommitment(participantAddress: Address): Promise<Commitment> {
    let commitment: Commitment;

    const result = await this.crucibleWrapper.commitments(
      this.address,
      participantAddress
    );

    commitment.exists = result[0];
    commitment.amount = result[1];
    commitment.metGoal = crucibleNumberToGoal(result[2]);

    return commitment;
  }

  /**
   * Gets the number of participants/commitments in this crucible
   *
   * @param  participantAddress   the address of the participant
   * @return                      true if participant exists, false otherwise
   */
  public async participantExists(
    participantAddress: Address
  ): Promise<boolean> {
    return await this.crucibleWrapper.participantExists(
      this.address,
      participantAddress
    );
  }

  /**
   * Gets current state of the crucible
   *
   * @return                      the current state
   */
  public async getState(): Promise<string> {
    const stateNum = await this.crucibleWrapper.state(this.address);
    return crucibleStateToString(crucibleNumberToState(stateNum));
  }

  /* ============ Private Assertions ============ */

  private async assertAddCommitment(
    inState: CrucibleState,
    participantAddress: Address,
    txOpts: Tx
  ) {
    const riskAmount = new BigNumber(txOpts.value);

    this.assert.schema.isValidNumber('riskAmount', riskAmount);
    this.assert.schema.isValidAddress('participantAddress', participantAddress);

    // make sure the contract we're pointed at is a Crucible
    await this.assert.crucible.implementsCrucible(this.address);

    await Promise.all([
      this.assert.crucible.inState(this.address, inState),
      this.assert.crucible.hasValidRiskAmountAsync(
        this.address, riskAmount
      ),
      this.assert.crucible.hasValidParticipantAsync(
        this.address, participantAddress
      ),
    ]);
  }

  private async assertSetGoal(
    states: CrucibleState[],
    participantAddress: Address,
    txOpts: Tx
  ) {
    const fromAddress = txOpts.from;

    this.assert.schema.isValidAddress('fromAddress', fromAddress);
    this.assert.schema.isValidAddress('participantAddress', participantAddress);

    // make sure the contract we're pointed at is a Crucible
    await this.assert.crucible.implementsCrucible(this.address);

    await Promise.all([
      this.assert.crucible.inEitherState(this.address, states),
      this.assert.crucible.hasValidOwnerAsync(
        this.address, fromAddress
      ),
      this.assert.crucible.hasValidParticipantAsync(
        this.address, participantAddress
      ),
    ]);
  }

  private async assertCanLockState(inState: CrucibleState, txOpts: Tx) {
    await this.assert.crucible.implementsCrucible(this.address);
    await Promise.all([
      this.assert.crucible.inState(this.address, inState),
      this.assert.crucible.pastLockTime(this.address),
    ]);
  }

  private async assertCanJudgementState(inState: CrucibleState, txOpts: Tx) {
    await this.assert.crucible.implementsCrucible(this.address);
    await Promise.all([
      this.assert.crucible.inState(this.address, inState),
      this.assert.crucible.pastEndTime(this.address),
    ]);
  }

}
