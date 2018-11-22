'use strict';

import * as _ from 'lodash';
import Web3 from 'web3';

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
  private address: Address;
  private crucibleWrapper: CrucibleWrapper;
  private web3: Web3;

  /**
   * Instantiates a new CrucibleAPI instance that contains methods for
   * interacting with a specific Crucible.
   *
   * @param web3        Web3.js Provider instance you would like the crucible.js
   *                    library to use for interacting with the Ethereum network
   * @param addr        the address of the crucible contract on the network
   */
  constructor(web3: Web3, addr: Address) {
    this.web3 = web3;
    this.address = addr;
    this.crucibleWrapper = new CrucibleWrapper(web3);
  }

  /**
   * Gets the number of participants/commitments in this crucible
   *
   * @return                 Number of commitments in crucible
   */
  public async getCommitmentCount(): Promise<BigNumber> {
    return await this.crucibleWrapper.getCommitmentCount(this.address);
  }

}
