'use strict';

import * as _ from 'lodash';
import Web3 from 'web3';

import { Assertions } from '../assertions';
import { FoundryWrapper } from '../wrappers';
import { TransactionReceipt } from 'ethereum-types';
import { BigNumber, awaitTx } from '../util';
import { Address, Tx } from '../types/common';

/**
 * @title FoundryAPI
 * @author Christopher Mooney
 *
 * A library for interacting with the foundry smart contract.  This contract
 * makes new Crucibles and tracks them.
 */
export class FoundryAPI {
  public address: Address;
  private assert: Assertions;
  private foundryWrapper: FoundryWrapper;
  private web3: Web3;

  /**
   * Instantiates a new FoundryAPI instance that contains methods for
   * creating, listing, and removing Crucibles.
   *
   * @param web3        Web3.js Provider instance you would like the crucible.js
   *                    library to use for interacting with the Ethereum network
   * @param addr        the address of the foundry contract on the network
   * @param assertions  An instance of the Assertion library
   */
  constructor(web3: Web3, addr: Address, assertions: Assertions) {
    this.web3 = web3;
    this.assert = assertions;
    this.address = addr;
    this.foundryWrapper = new FoundryWrapper(web3);
  }

  /**
   * Creates a Crucible contract
   *
   * @param  validator    Address of validator/oracle/owner
   * @param  beneficiary  Address of the beneficiary.  This can just be the
   *                      empty address for pooled penalty behavior, but if
   *                      you want all penalties, less the fee, to go to one
   *                      address, this is what you would use.
   * @param  startDate    Usually the epoch timestamp (seconds) when the
   *                      Crucible was created.
   * @param  lockDate     The epoch timestamp (seconds) when the Crucible is
   *                      no longer taking new participants, and the point
   *                      when the Crucible begins.  This date allows one
   *                      to change the Crucible state to LOCKED.
   * @param  endDate      The epoch timestamp (seconds) when the Crucible is
   *                      finished.  This date allows one to change the
   *                      Crucible state to JUDGEMENT.
   * @param  minAmountWei The minimum commitment amount in Wei.  This must be
   *                      greater than 0, and is suggested to be greater than
   *                      gasCost for the different contract interfaces.
   * @param  timeout      The number of seconds, when added to endDate, that
   *                      allows one to change the Crucible state to BROKEN.
   * @param  feeNumerator The parts in a 1000 that the validator/oracle/owner
   *                      takes as a fee.  e.g. 0/1000 = 0%, 10/1000 = 1%,
   *                      500/1000 = 50%, and 1000/1000 = 100%. The default is
   *                      100/1000 = 10%.
   * @param  txOpts       Transaction options object conforming to `Tx` with
   *                      signer, gas, and gasPrice data
   * @return              Transaction hash
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
    await this.assertCreateCrucible(
      startDate, lockDate, endDate, minAmountWei, timeout, txOpts
    );

    return await this.foundryWrapper.newCrucible(
      this.address,
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
   * Gets the number of crucibles tracked by the foundry
   *
   * @return                 Number of crucibles tracked by the foundry
   */
  public async getCount(): Promise<BigNumber> {
    return await this.foundryWrapper.getCount(this.address);
  }

  /**
   * get a crucible address from the transaction hash passed back from
   * createCrucible()
   *
   * @param  receipt         TransactionReceipt from a mined transaction
   * @return                 Address of the new crucibe contract
   */
  public async getCrucibleAddressFromReceipt(
    receipt: TransactionReceipt
  ): Promise<Address> {
    return await this.foundryWrapper.getCrucibleAddressFromReceipt(
      this.address,
      receipt
    );
  }

  /**
   * get a crucible address from an index number
   *
   * @param  index           the index of the crucible
   * @return                 Address of the crucibe contract at that index
   */
  public async getCrucibleAddressFromIndex(index: BigNumber): Promise<Address> {
    return await this.foundryWrapper.getCrucibleAddressFromIndex(
      this.address,
      index
    );
  }

  /**
   * get a crucible address from an index number
   *
   * @param  crucibleAddress the Address of the crucible
   * @return                 the index of the crucible
   */
  public async getCrucibleIndexFromAddress(
    crucibleAddress: Address
  ): Promise<BigNumber> {
    return await this.foundryWrapper.getCrucibleIndexFromAddress(
      this.address,
      crucibleAddress
    );
  }

  /**
   * Deletes the Crucible contract specified by crucibleAddress
   *
   * @param  crucibleAddress Address of the Crucible contract to delete
   * @param  txOpts          Transaction options object conforming to `Tx` with
   *                         signer, gas, and gasPrice data
   * @return                 Transaction hash
   */
  public async deleteCrucible(
    crucibleAddress: Address,
    txOpts: Tx
  ): Promise<string> {
    const index = await this.getCrucibleIndexFromAddress(crucibleAddress);

    await this.assertDeleteCrucible(index, crucibleAddress, txOpts);

    return await this.foundryWrapper.deleteCrucible(
      this.address, crucibleAddress, index, txOpts
    );
  }

  /* ============ Private Assertions ============ */

  private async assertDeleteCrucible(
    index: BigNumber,
    addressToDelete: Address,
    txOpts: Tx
  ) {
    const fromAddress = txOpts.from;

    this.assert.schema.isValidAddress('fromAddress', fromAddress);
    this.assert.schema.isValidWholeNumber('index', index);
    this.assert.schema.isValidAddress('addressToDelete', addressToDelete);

    // make sure the contract we're pointed at is a Foundry
    await this.assert.foundry.implementsFoundry(this.address);

    await Promise.all([
      this.assert.foundry.hasValidOwnerAsync(
        this.address, fromAddress
      ),
      this.assert.foundry.hasCruciblesAsync(
        this.address
      ),
      this.assert.foundry.hasCorrectIndexAsync(
        this.address, index, addressToDelete
      ),
    ]);
  }

  private async assertCreateCrucible(
    startDate: BigNumber,
    lockDate: BigNumber,
    endDate: BigNumber,
    minAmountWei: BigNumber,
    timeout: BigNumber,
    txOpts: Tx
  ) {
    const fromAddress = txOpts.from;

    this.assert.schema.isValidAddress('fromAddress', fromAddress);
    this.assert.schema.isValidWholeNumber('startDate', startDate);
    this.assert.schema.isValidWholeNumber('lockDate', lockDate);
    this.assert.schema.isValidWholeNumber('endDate', endDate);
    this.assert.schema.isValidWholeNumber('minAmountWei', minAmountWei);
    this.assert.schema.isValidWholeNumber('timeout', timeout);

    // make sure the contract we're pointed at is a Foundry
    await this.assert.foundry.implementsFoundry(this.address);

    this.assert.foundry.hasValidDates(startDate, lockDate, endDate);
    this.assert.foundry.hasValidTimeout(startDate, endDate, timeout);
    this.assert.foundry.hasValidMinAmount(minAmountWei);
  }

}
