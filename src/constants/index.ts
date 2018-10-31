'use strict';

import { SetProtocolUtils } from 'set-protocol-utils';

import { BigNumber } from '../util';
import { ether } from '../util/units';
import { DEFAULT_ACCOUNT } from './accounts';
import { Tx } from '../types/common';

export { DEFAULT_ACCOUNT };
export const DEFAULT_GAS_LIMIT: number = 6712390; // default of 6.7 million gas
export const DEFAULT_GAS_PRICE: number = 3000000000; // 3 gwei
export const E18: BigNumber = new BigNumber(10).pow(18);
export const NULL_ADDRESS = SetProtocolUtils.CONSTANTS.NULL_ADDRESS;
export const ONE_DAY_IN_SECONDS = new BigNumber(86400);
export const STANDARD_DECIMALS: BigNumber = new BigNumber(18); // ETH natural unit, wei
export const STANDARD_SUPPLY: BigNumber = new BigNumber(100000000000000000000); // 100 Ether
export const STANDARD_TRANSFER_VALUE: BigNumber = new BigNumber(1000000000000000000); // 1 Ether
export const ZERO: BigNumber = SetProtocolUtils.CONSTANTS.ZERO;

// Returns a big number that can be passed in as a smart contract parameter
export function UINT256(value: number): BigNumber {
  return new BigNumber(value);
}

export const TX_DEFAULTS: Tx = {
  from: DEFAULT_ACCOUNT,
  gasPrice: DEFAULT_GAS_PRICE,
  gas: DEFAULT_GAS_LIMIT,
};
