import { Address, UInt } from 'set-protocol-utils';
import { BigNumber } from '../util';
import { BaseContract } from './base_contract';
import * as _ from "lodash";

export { TransactionReceipt } from 'ethereum-types';
export { Tx } from 'web3/eth/types';
export { Address, UInt } from 'set-protocol-utils';
export { BaseContract } from './base_contract';

export enum GoalState {
  WAITING = 0,
  PASS    = 1,
  FAIL    = 2
};

export enum CrucibleState {
  OPEN      = 0,
  LOCKED    = 1,
  JUDGEMENT = 2,
  FINISHED  = 3,
  PAID      = 4,
  BROKEN    = 5,
  KILLED    = 6
};

export interface Commitment {
  exists: boolean;
  amount: BigNumber;
  metGoal: GoalState;
}

export const classUtils = {
  bindAll(self: any, exclude: string[] = ["contructor"], thisArg?: any): void {
    for (const key of Object.getOwnPropertyNames(self)) {
      const val = self[key];
      if (!_.includes(exclude, key)) {
        if (_.isFunction(val)) {
          self[key] = val.bind(thisArg || self);
        } else if (_.isObject(val)) {
          classUtils.bindAll(val, exclude, self);
        }
      }
    }
    return self;
  },
};

export enum SolidityTypes {
  Address = 'address',
  Uint256 = 'uint256',
  Uint8 = 'uint8',
  Uint = 'uint',
  AddressArray = 'address[]',
  UintArray = 'uint256[]'
};
