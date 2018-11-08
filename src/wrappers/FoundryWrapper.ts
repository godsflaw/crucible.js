'use strict';

import Web3 from 'web3';

import { ContractWrapper } from '.';
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
   * Gets the number of crucibles tracked by the foundry
   *
   * @param  foundryAddress   The address of the foundry contract
   * @return                  Number of crucibles tracked by the foundry
   */
  public async getCount(foundryAddress: Address): Promise<BigNumber> {
    const foundryInstance = await this.contracts.loadFoundry(foundryAddress);

    return await foundryInstance.getCount.callAsync();
  }

//  /**
//   * Asynchronously transfer the value amount in the token specified so long
//   * as the sender of the message has received sufficient allowance on behalf
//   * of `from` to do so.
//   *
//   * @param  tokenAddress   The address of the token being used.
//   * @param  from           From whom are the funds being transferred.
//   * @param  to             To whom are the funds being transferred.
//   * @param  value          The amount to be transferred.
//   * @param  txOpts         Any parameters necessary to modify the transaction.
//   * @return                The hash of the resulting transaction.
//   */
//  public async transferFrom(
//    tokenAddress: Address,
//    from: Address,
//    to: Address,
//    value: BigNumber,
//    txOpts?: Tx,
//  ): Promise<string> {
//    const tokenInstance = await this.contracts.loadERC20TokenAsync(tokenAddress);
//    const txOptions = await generateTxOpts(this.web3, txOpts);
//
//    return await tokenInstance.transferFrom.sendTransactionAsync(from, to, value, txOptions);
//  }
}
