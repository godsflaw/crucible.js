'use strict';

import Web3 from 'web3';
import { Provider } from 'web3/providers';

// import { FoundryAPI } from './api';
import { BigNumber, instantiateWeb3 } from './util';
import { Address, TransactionReceipt, Tx } from './types/common';
import { NULL_ADDRESS } from './constants';

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
//  private foundry: FoundryWrapper;

  public static NULL_ADDRESS = NULL_ADDRESS;

  /**
   * An instance of the ListingAPI class containing methods for listing a
   * crucible.
   */
//  public listings: ListingAPI;

    /**
   * Instantiates a new Crucible instance that provides the public interface
   * to the Crucible.js library
   *
   * @param provider    Provider instance you would like the Crucible.js
   *                    library to use for interacting with the Ethereum network
   * @param config      Configuration object conforming to CrucibleConfig with
   *                    the foundry's proxy address
   */
  constructor(provider: Provider, config: LibCrucibleConfig) {
    this.web3 = instantiateWeb3(provider);
//    this.foundry = new FoundryWrapper(this.web3, config.foundryAddress);
//    this.listings = new ListingAPI(this.web3, this.foundry);
  }

//  /**
//   * Creates a new Crucible
//   *
//   * @param owner         the owner/validator/oracle of the Crucible
//   * @param beneficiary   address where penalty funds are sent, or null for
//   *                      those funds to be sent to the owner/pool
//   * @param startDate     the epoch timestamp when the Crucible starts
//   * @param lockDate      the epoch timestamp when the Crucible is locked
//   * @param endDate       the epoch timestamp when the Crucible ends
//   * @param minAmountWei  all commitments must be at least this amount
//   * @param timeout       amount of time after endDate before one can move
//   *                      the crucible into the BROKEN state
//   * @param feeNumerator  the parts of 1000 for the fee.  e.g. 0/1000 = 0%,
//   *                      10/1000 = 1%, 500/1000 = 50%, and 1000/1000 = 100%
//   * @return              Returns a Promise<Crucible>
//   */
//  public async createCrucible(
//    owner: Address,
//    beneficiary: Address,
//    startDate: number,
//    lockDate: number,
//    endDate: number,
//    minAmountWei: BigNumber,
//    timeout: number,
//    feeNumerator: number
//  ): Promise<Crucible> {
//    return await this.foundry.newCrucible(
//      owner,
//      beneficiary,
//      startDate,
//      lockDate,
//      endDate,
//      minAmountWei,
//      timeout,
//      feeNumerator
//    );
//  }
//
//  /**
//   * get the number of crucibles tracked by the foundry
//   *
//   * @return           The number of crucibles tracked by the foundry
//   */
//  public async getCrucibleCount(): Promise<BigNumber> {
//    return await this.foundry.getCount();
//  }

}

export default LibCrucible;
