'use strict';

import Web3 from 'web3';
import { FoundryContract, CrucibleContract } from '../types/generated';
import { Address, BaseContract } from '../types/common';

/**
 * @title ContractWrapper
 * @author Christopher Mooney
 *
 * The Contracts API handles all functions that load contracts
 *
 */
export class ContractWrapper {
  private web3: Web3;
  private cache: { [contractName: string]: BaseContract };

  public constructor(web3: Web3) {
    this.web3 = web3;
    this.cache = {};
  }

  /**
   * Load Foundry contract
   *
   * @param  foundryAddress     Address of the Foundry contract
   * @param  transactionOptions Options sent into the contract deployed method
   * @return                    The Foundry Contract
   */
  public async loadFoundry(
    foundryAddress: Address,
    transactionOptions: object = {},
  ): Promise<FoundryContract> {
    const cacheKey = this.getFoundryCacheKey(foundryAddress);

    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as FoundryContract;
    } else {
      const foundryContract = await FoundryContract.at(
        foundryAddress,
        this.web3,
        transactionOptions,
      );
      this.cache[cacheKey] = foundryContract;
      return foundryContract;
    }
  }

  /**
   * Load Crucible contract
   *
   * @param  crucibleAddress    Address of the Crucible contract
   * @param  transactionOptions Options sent into the contract deployed method
   * @return                    The Crucible Contract
   */
  public async loadCrucible(
    crucibleAddress: Address,
    transactionOptions: object = {},
  ): Promise<CrucibleContract> {
    const cacheKey = this.getCrucibleCacheKey(crucibleAddress);

    if (cacheKey in this.cache) {
      return this.cache[cacheKey] as CrucibleContract;
    } else {
      const crucibleContract = await CrucibleContract.at(
        crucibleAddress,
        this.web3,
        transactionOptions,
      );
      this.cache[cacheKey] = crucibleContract;
      return crucibleContract;
    }
  }

  /**
   * Creates a string used for accessing values in the foundry cache
   *
   * @param  foundryAddress Address of the Foundry contract to use
   * @return                The foundry key
   */
  private getFoundryCacheKey(foundryAddress: Address): string {
    return `Foundry_${foundryAddress}`;
  }

  /**
   * Creates a string used for accessing values in the crucible
   *
   * @param  crucibleAddress Address of the crucible contract to use
   * @return                 The crucible key
   */
  private getCrucibleCacheKey(crucibleAddress: Address): string {
    return `Crucible_${crucibleAddress}`;
  }
}
