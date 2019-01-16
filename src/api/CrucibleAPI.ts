'use strict';

import * as _ from 'lodash';
import Web3 from 'web3';

import { Assertions } from '../assertions';
import { libCrucibleErrors } from '../errors';
import { CrucibleWrapper } from '../wrappers';
import { TransactionReceipt } from 'ethereum-types';
import { BigNumber, awaitTx } from '../util';
import { Address, Tx } from '../types/common';

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
    await this.assertAddCommitment(participantAddress, txOpts);

    return await this.crucibleWrapper.add(
      this.address, participantAddress, txOpts
    );
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
   * Gets the number of participants/commitments in this crucible
   *
   * @param  participantAddress   the address of the participant
   * @return                      true if participant exists, false otherwise
   */
  public async participantExists(participantAddress: Address): Promise<boolean> {
    return await this.crucibleWrapper.participantExists(
      this.address,
      participantAddress
    );
  }

  /* ============ Private Assertions ============ */

  private async assertAddCommitment(participantAddress: Address, txOpts: Tx) {
    const riskAmount = new BigNumber(txOpts.value);

    this.assert.schema.isValidNumber('riskAmount', riskAmount);
    this.assert.schema.isValidAddress('participantAddress', participantAddress);
    await this.assert.crucible.hasValidRiskAmountAsync(
      this.address, riskAmount
    );
  }

}
