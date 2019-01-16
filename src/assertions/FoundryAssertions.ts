'use strict';

import Web3 from 'web3';

import { Address } from '../types/common';
import { FoundryContract } from '../types/generated';
import { NULL_ADDRESS } from '../constants';
import { foundryAssertionErrors } from '../errors';
import { BigNumber } from '../util';

/**
 * @title  FoundryAssertions
 * @author Christopher Mooney
 *
 * This interface should provide the client with a clear assertion failure
 * without having to send the transaction to the blockchain and have the throw
 * come out-of-band from conrol flow.  Basically, we will try to put all
 * possible assertion errors in here and catch them before sending anything to
 * the chain.
 */
export class FoundryAssertions {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  /**
   * Throws if the given contract address does not respond to some methods from
   * the foundry interface
   */
  public async implementsFoundry(foundryAddress: Address): Promise<void> {
    const foundryContract = await FoundryContract.at(foundryAddress, this.web3, {});

    try {
      await Promise.all([
        // foundryContract.crucibles.callAsync('0'),
        foundryContract.owner.callAsync(),
        // foundryContract.getCount.callAsync(),
        // foundryContract.getIndexOf.callAsync('0'),
      ]);
    } catch (error) {
      throw new Error(foundryAssertionErrors.MISSING_FOUNDRY_METHOD(foundryAddress));
    }
  }

}
