'use strict';

import * as _ from 'lodash';
import Web3 from 'web3';

import { FoundryWrapper } from '../wrappers';
import { BigNumber } from '../util';
import { Address, Tx } from '../types/common';

/**
 * @title FoundryAPI
 * @author Christopher Mooney
 *
 * A library for interacting with the foundry smart contract.  This contract
 * makes new Crucibles and tracks them.
 */
export class FoundryAPI {
  private address: Address;
  private foundryWrapper: FoundryWrapper;
  private web3: Web3;

  /**
   * Instantiates a new FoundryAPI instance that contains methods for
   * creating, listing, and removing Crucibles.
   *
   * @param web3        Web3.js Provider instance you would like the crucible.js
   *                    library to use for interacting with the Ethereum network
   * @param addr        the address of the foundry contract on the network
   */
  constructor(web3: Web3, addr: Address) {
    this.web3 = web3;
    this.address = addr;
    this.foundryWrapper = new FoundryWrapper(web3);
  }

  /**
   * Gets the number of crucibles tracked by the foundry
   *
   * @return                 Number of crucibles tracked by the foundry
   */
  public async getCount(): Promise<BigNumber> {
    return await this.foundryWrapper.getCount(this.address);
  }

//  /**
//   * Deletes the Crucible contract specified by crucibleAddress
//   *
//   * @param  addr            Address of the Crucible contract to delete
//   * @param  txOpts          Transaction options object conforming to `Tx` with
//   *                         signer, gas, and gasPrice data
//   * @return                 Transaction hash
//   */
//  public async deleteCrucible(addr: Address, txOpts: Tx): Promise<string> {
//    return await this.foundryWrapper.deleteCrucible(this.address, addr, txOpts);
//  }

}
