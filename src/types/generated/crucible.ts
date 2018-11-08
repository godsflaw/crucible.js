'use strict';

 /**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at:
 *  https://github.com/0xProject/0x-monorepo/blob/development/packages/contract_templates/contract.handlebars
 */
import { promisify } from '@0xproject/utils';
import { Crucible as ContractArtifacts } from '../../artifacts/ts/Crucible';
import Web3 from 'web3';
import Contract from "web3/eth/contract";
import { ABIDefinition } from "web3/eth/abi";
import { Tx } from "web3/eth/types";
import { BigNumber, BN, UInt, Web3Utils } from 'set-protocol-utils';

import { BaseContract, CONTRACT_WRAPPER_ERRORS } from '../base_contract';
import { classUtils } from '../common';

export class CrucibleContract extends BaseContract {
  public startDate = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.startDate(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public penalty = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.penalty(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public feeDenominator = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.feeDenominator(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public participants = {
    async callAsync(
      index_0: BigNumber,
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as CrucibleContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.methods.participants(
          index_0,
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public beneficiary = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as CrucibleContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.methods.beneficiary(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public version = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as CrucibleContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.methods.version(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public penaltyPaid = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<boolean
  > {
      const self = this as CrucibleContract;
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.methods.penaltyPaid(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public lockDate = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.lockDate(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public timeout = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.timeout(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public renounceOwnership = {
    async sendTransactionAsync(
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.renounceOwnership.estimateGasAsync.bind(
          self,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.renounceOwnership(
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.renounceOwnership(
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.renounceOwnership(
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.renounceOwnership(
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public passCount = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.passCount(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public owner = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as CrucibleContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.methods.owner(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public released = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.released(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public feePaid = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<boolean
  > {
      const self = this as CrucibleContract;
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.methods.feePaid(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public minimumAmount = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.minimumAmount(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public trackingBalance = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.trackingBalance(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public state = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.state(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public endDate = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.endDate(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public reserve = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.reserve(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public fee = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.fee(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public calculateFee = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<boolean
  > {
      const self = this as CrucibleContract;
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.methods.calculateFee(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public feeNumerator = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.feeNumerator(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public commitments = {
    async callAsync(
      index_0: string,
      defaultBlock?: any,
    ): Promise<[boolean, BigNumber, BigNumber]
  > {
      const self = this as CrucibleContract;
      const result = await promisify<[boolean, BigNumber, BigNumber]
  >(
        self.web3ContractInstance.methods.commitments(
          index_0,
        ).call,
        self.web3ContractInstance,
      )();
      return result;
    },
  };
  public transferOwnership = {
    async sendTransactionAsync(
      _newOwner: string,
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.transferOwnership.estimateGasAsync.bind(
          self,
          _newOwner,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.transferOwnership(
          _newOwner,
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _newOwner: string,
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.transferOwnership(
          _newOwner,
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _newOwner: string,
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.transferOwnership(
        _newOwner,
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _newOwner: string,
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.transferOwnership(
          _newOwner,
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public kill = {
    async sendTransactionAsync(
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.kill.estimateGasAsync.bind(
          self,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.kill(
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.kill(
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.kill(
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.kill(
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public count = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as CrucibleContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.count(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public participantExists = {
    async callAsync(
      _participant: string,
      defaultBlock?: any,
    ): Promise<boolean
  > {
      const self = this as CrucibleContract;
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.methods.participantExists(
          _participant,
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public add = {
    async sendTransactionAsync(
      _participant: string,
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.add.estimateGasAsync.bind(
          self,
          _participant,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.add(
          _participant,
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _participant: string,
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.add(
          _participant,
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _participant: string,
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.add(
        _participant,
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _participant: string,
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.add(
          _participant,
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public collectFee = {
    async sendTransactionAsync(
      _destination: string,
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.collectFee.estimateGasAsync.bind(
          self,
          _destination,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.collectFee(
          _destination,
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _destination: string,
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.collectFee(
          _destination,
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _destination: string,
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.collectFee(
        _destination,
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _destination: string,
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.collectFee(
          _destination,
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public payout = {
    async sendTransactionAsync(
      _startIndex: BigNumber,
      _records: BigNumber,
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.payout.estimateGasAsync.bind(
          self,
          _startIndex,
          _records,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.payout(
          _startIndex,
          _records,
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _startIndex: BigNumber,
      _records: BigNumber,
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.payout(
          _startIndex,
          _records,
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _startIndex: BigNumber,
      _records: BigNumber,
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.payout(
        _startIndex,
        _records,
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _startIndex: BigNumber,
      _records: BigNumber,
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.payout(
          _startIndex,
          _records,
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public setGoal = {
    async sendTransactionAsync(
      _participant: string,
      _metGoal: boolean,
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.setGoal.estimateGasAsync.bind(
          self,
          _participant,
          _metGoal,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.setGoal(
          _participant,
          _metGoal,
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _participant: string,
      _metGoal: boolean,
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.setGoal(
          _participant,
          _metGoal,
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _participant: string,
      _metGoal: boolean,
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.setGoal(
        _participant,
        _metGoal,
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _participant: string,
      _metGoal: boolean,
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.setGoal(
          _participant,
          _metGoal,
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public lock = {
    async sendTransactionAsync(
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.lock.estimateGasAsync.bind(
          self,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.lock(
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.lock(
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.lock(
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.lock(
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public judgement = {
    async sendTransactionAsync(
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.judgement.estimateGasAsync.bind(
          self,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.judgement(
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.judgement(
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.judgement(
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.judgement(
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public finish = {
    async sendTransactionAsync(
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.finish.estimateGasAsync.bind(
          self,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.finish(
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.finish(
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.finish(
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.finish(
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public paid = {
    async sendTransactionAsync(
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.paid.estimateGasAsync.bind(
          self,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.paid(
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.paid(
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.paid(
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.paid(
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public broken = {
    async sendTransactionAsync(
      txData: Tx = {},
    ): Promise<string> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.broken.estimateGasAsync.bind(
          self,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.broken(
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      txData: Tx = {},
    ): Promise<number> {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.broken(
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      txData: Tx = {},
    ): string {
      const self = this as CrucibleContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.broken(
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as CrucibleContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.broken(
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  async deploy(data: string, args: any[]): Promise<any> {
    const wrapper = this;

    wrapper.web3ContractInstance.deploy({
      data,
      arguments: args,
    })
    .send(wrapper.defaults)
    .then(function(newContractInstance){
      wrapper.web3ContractInstance = newContractInstance;
      wrapper.address = newContractInstance.options.address;
    });
  }
  static async deployed(web3: Web3, defaults: Tx): Promise<CrucibleContract> {
    const web3Utils = new Web3Utils(web3);
    const currentNetwork = await web3Utils.getNetworkIdAsync();
    const { abi, networks }: { abi: any[]; networks: any } = ContractArtifacts;
    const web3ContractInstance = new web3.eth.Contract(abi, networks[currentNetwork].address);

    return new CrucibleContract(web3ContractInstance, defaults);
  }
  static async at(
    address: string,
    web3: Web3,
    defaults: Tx,
  ): Promise<CrucibleContract> {
    const { abi }: { abi: any[] } = ContractArtifacts;
    const web3Utils = new Web3Utils(web3);
    const contractExists = await web3Utils.doesContractExistAtAddressAsync(address);
    const currentNetwork = await web3Utils.getNetworkIdAsync();

    if (contractExists) {
      const web3ContractInstance = new web3.eth.Contract(abi, address);

      return new CrucibleContract(web3ContractInstance, defaults);
    } else {
      throw new Error(
        CONTRACT_WRAPPER_ERRORS.CONTRACT_NOT_FOUND_ON_NETWORK('Crucible', currentNetwork),
      );
    }
  }
  constructor(web3ContractInstance: Contract, defaults: Tx) {
    super(web3ContractInstance, defaults);
    classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
  }
} // tslint:disable:max-file-line-count
