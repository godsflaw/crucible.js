'use strict';

import Web3 from 'web3';

import { ContractWrapper } from '.';
import { TransactionReceipt } from 'ethereum-types';
import { NULL_ADDRESS } from '../constants';
import { Address, Tx } from '../types/common';
import { BigNumber, generateTxOpts } from '../util';

/**
 * @title  FoundryWrapper
 * @author Christopher Mooney
 *
 * The FoundryWrapper handles all functions on the Foundry smart contract.
 *
 */
export class FoundryWrapper {
  private web3: Web3;
  private contracts: ContractWrapper;

  public constructor(web3: Web3) {
    this.web3 = web3;
    this.contracts = new ContractWrapper(this.web3);
  }

  /**
   * get the crucible address from a particular transaction receipt
   *
   * @param  foundryAddress   The address of the foundry contract
   * @param  receipt          TransactionReceipt from a transaction
   * @return                  Address of the crucible contract
   */
  public async getCrucibleAddressFromReceipt(
    foundryAddress: Address,
    receipt: TransactionReceipt
  ): Promise<Address> {
    let crucibleAddress: Address = NULL_ADDRESS;
    const foundryInstance = await this.contracts.loadFoundry(foundryAddress);
    const foundryWeb3ContractInstance = foundryInstance.web3ContractInstance;

    let events = await foundryWeb3ContractInstance.getPastEvents(
      'CrucibleCreated',
      {
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber
      }
    );

    for (let i = 0; i < events.length; i++) {
      if (events[i].transactionHash === receipt.transactionHash) {
        crucibleAddress = events[i].returnValues['contractAddress'];
        break;
      }
    }

    return crucibleAddress;
  }

  /**
   * get the crucible address from a particular index
   *
   * @param  foundryAddress   The address of the foundry contract
   * @param  index            the index of the crucible to get
   * @return                  Address of the crucible contract
   */
  public async getCrucibleAddressFromIndex(
    foundryAddress: Address,
    index: BigNumber
  ): Promise<Address> {
    const foundryInstance = await this.contracts.loadFoundry(foundryAddress);

    return await foundryInstance.crucibles.callAsync(index);
  }

  /**
   * Gets the number of crucibles tracked by the foundry
   *
   * @param  foundryAddress   The address of the foundry contract
   * @return                  Number of crucibles tracked by the foundry
   */
  public async getCount(foundryAddress: Address): Promise<BigNumber> {
    const foundryInstance = await this.contracts.loadFoundry(foundryAddress);

    return await foundryInstance.getCount.callAsync();
  }

  /**
   * Creates a Crucible contract
   *
   * @param  foundryAddress The address of the foundry contract
   * @param  validator      Address of validator/oracle/owner
   * @param  beneficiary    Address of the beneficiary.  This can just be the
   *                        empty address for pooled penalty behavior, but if
   *                        you want all penalties, less the fee, to go to one
   *                        address, this is what you would use.
   * @param  startDate      Usually the epoch timestamp (seconds) when the
   *                        Crucible was created.
   * @param  lockDate       The epoch timestamp (seconds) when the Crucible is
   *                        no longer taking new participants, and the point
   *                        when the Crucible begins.  This date allows one
   *                        to change the Crucible state to LOCKED.
   * @param  endDate        The epoch timestamp (seconds) when the Crucible is
   *                        finished.  This date allows one to change the
   *                        Crucible state to JUDGEMENT.
   * @param  minAmountWei   The minimum commitment amount in Wei.  This must be
   *                        greater than 0, and is suggested to be greater than
   *                        gasCost for the different contract interfaces.
   * @param  timeout        The number of seconds, when added to endDate, that
   *                        allows one to change the Crucible state to BROKEN.
   * @param  feeNumerator   The parts in a 1000 that the validator/oracle/owner
   *                        takes as a fee.  e.g. 0/1000 = 0%, 10/1000 = 1%,
   *                        500/1000 = 50%, and 1000/1000 = 100%. The default is
   *                        100/1000 = 10%.
   * @param  txOpts         Transaction options object conforming to `Tx` with
   *                        signer, gas, and gasPrice data
   * @return                The hash of the resulting transaction.
   */
  public async newCrucible(
    foundryAddress: Address,
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
    const foundryInstance = await this.contracts.loadFoundry(foundryAddress);
    const txOptions = await generateTxOpts(this.web3, txOpts);

    return await foundryInstance.newCrucible.sendTransactionAsync(
      validator,
      beneficiary,
      startDate,
      lockDate,
      endDate,
      minAmountWei,
      timeout,
      feeNumerator,
      txOptions
    );
  }
}
