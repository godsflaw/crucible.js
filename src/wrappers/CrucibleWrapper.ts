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
   * Gets the number of participants/commitments in this crucible
   *
   * @param  crucibleAddress   The address of the crucible contract
   * @return                  Number of commitments in crucible
   */
  public async getCommitmentCount(crucibleAddress: Address): Promise<BigNumber> {
    const crucibleInstance = await this.contracts.loadCrucible(crucibleAddress);

    return await crucibleInstance.count.callAsync();
  }
}
