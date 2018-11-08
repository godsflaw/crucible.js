import { Address, UInt } from 'set-protocol-utils';
import { BigNumber } from '../util';
import { BaseContract } from './base_contract';
import * as _ from "lodash";

export { TransactionReceipt } from 'ethereum-types';
export { Tx } from 'web3/eth/types';
export { Address, UInt } from 'set-protocol-utils';
export { BaseContract } from './base_contract';

export interface Component {
  address: Address;
  unit: BigNumber;
}

export const GoalState = {
  WAITING: new BigNumber(1),
  PASS: new BigNumber(2),
  FAIL: new BigNumber(3),
};

export const CrucibleState = {
  OPEN: new BigNumber(1),
  LOCKED: new BigNumber(2),
  JUDGEMENT: new BigNumber(3),
  FINISHED: new BigNumber(4),
  PAID: new BigNumber(5),
  BROKEN: new BigNumber(6),
  KILLED: new BigNumber(7),
};

export interface CrucibleProperties {
  owner: Address;
  beneficiary: Address;
  startDate: UInt;
  lockDate: UInt;
  endDate: UInt;
  minAmountWei: BigNumber;
  timeout: UInt;
  feeNumerator: BigNumber;
}

export interface JSONRPCRequestPayload {
  params: any[];
  method: string;
  id: number;
  jsonrpc: string;
}

export interface JSONRPCResponsePayload {
  result: any;
  id: number;
  jsonrpc: string;
}

export declare type JSONRPCErrorCallback =
  (err: Error | null, result?: JSONRPCResponsePayload) => void;


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
