'use strict';

 /**
 * This file is auto-generated using abi-gen. Don't edit directly.
 * Templates can be found at:
 *  https://github.com/0xProject/0x-monorepo/blob/development/packages/contract_templates/contract.handlebars
 */
import { promisify } from '@0xproject/utils';
import { Foundry as ContractArtifacts } from '../../artifacts/ts/Foundry';
import Web3 from 'web3';
import Contract from "web3/eth/contract";
import { ABIDefinition } from "web3/eth/abi";
import { Tx } from "web3/eth/types";
import { BigNumber, BN, UInt, Web3Utils } from 'set-protocol-utils';

import { BaseContract, CONTRACT_WRAPPER_ERRORS } from '../base_contract';
import { classUtils } from '../common';

export class FoundryContract extends BaseContract {
  public crucibles = {
    async callAsync(
      index_0: BigNumber,
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as FoundryContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.methods.crucibles(
          index_0,
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
      const self = this as FoundryContract;
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
      const self = this as FoundryContract;
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
      const self = this as FoundryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.renounceOwnership(
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as FoundryContract;
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
  public owner = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<string
  > {
      const self = this as FoundryContract;
      const result = await promisify<string
  >(
        self.web3ContractInstance.methods.owner(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public isMigrated = {
    async callAsync(
      contractName: string,
      migrationId: string,
      defaultBlock?: any,
    ): Promise<boolean
  > {
      const self = this as FoundryContract;
      const result = await promisify<boolean
  >(
        self.web3ContractInstance.methods.isMigrated(
          contractName,
          migrationId,
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
      const self = this as FoundryContract;
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
      const self = this as FoundryContract;
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
      const self = this as FoundryContract;
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
      const self = this as FoundryContract;
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
  public getCount = {
    async callAsync(
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as FoundryContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.getCount(
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public getIndexOf = {
    async callAsync(
      _crucible: string,
      defaultBlock?: any,
    ): Promise<BigNumber
  > {
      const self = this as FoundryContract;
      const result = await promisify<BigNumber
  >(
        self.web3ContractInstance.methods.getIndexOf(
          _crucible,
        ).call,
        self.web3ContractInstance,
      )();
      
      return result;
    },
  };
  public newCrucible = {
    async sendTransactionAsync(
      _owner: string,
      _beneficiary: string,
      _startDate: BigNumber,
      _lockDate: BigNumber,
      _endDate: BigNumber,
      _minimumAmount: BigNumber,
      _timeout: BigNumber,
      _feeNumerator: BigNumber,
      txData: Tx = {},
    ): Promise<string> {
      const self = this as FoundryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.newCrucible.estimateGasAsync.bind(
          self,
          _owner,
          _beneficiary,
          _startDate,
          _lockDate,
          _endDate,
          _minimumAmount,
          _timeout,
          _feeNumerator,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.newCrucible(
          _owner,
          _beneficiary,
          _startDate,
          _lockDate,
          _endDate,
          _minimumAmount,
          _timeout,
          _feeNumerator,
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _owner: string,
      _beneficiary: string,
      _startDate: BigNumber,
      _lockDate: BigNumber,
      _endDate: BigNumber,
      _minimumAmount: BigNumber,
      _timeout: BigNumber,
      _feeNumerator: BigNumber,
      txData: Tx = {},
    ): Promise<number> {
      const self = this as FoundryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.newCrucible(
          _owner,
          _beneficiary,
          _startDate,
          _lockDate,
          _endDate,
          _minimumAmount,
          _timeout,
          _feeNumerator,
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _owner: string,
      _beneficiary: string,
      _startDate: BigNumber,
      _lockDate: BigNumber,
      _endDate: BigNumber,
      _minimumAmount: BigNumber,
      _timeout: BigNumber,
      _feeNumerator: BigNumber,
      txData: Tx = {},
    ): string {
      const self = this as FoundryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.newCrucible(
        _owner,
        _beneficiary,
        _startDate,
        _lockDate,
        _endDate,
        _minimumAmount,
        _timeout,
        _feeNumerator,
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _owner: string,
      _beneficiary: string,
      _startDate: BigNumber,
      _lockDate: BigNumber,
      _endDate: BigNumber,
      _minimumAmount: BigNumber,
      _timeout: BigNumber,
      _feeNumerator: BigNumber,
      txData: Tx = {},
    ): Promise<string
  > {
      const self = this as FoundryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<string
  >(
        self.web3ContractInstance.methods.newCrucible(
          _owner,
          _beneficiary,
          _startDate,
          _lockDate,
          _endDate,
          _minimumAmount,
          _timeout,
          _feeNumerator,
        ).call,
        self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return result;
    },
  };
  public deleteCrucible = {
    async sendTransactionAsync(
      _address: string,
      _index: BigNumber,
      txData: Tx = {},
    ): Promise<string> {
      const self = this as FoundryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
        self.deleteCrucible.estimateGasAsync.bind(
          self,
          _address,
          _index,
        ),
      );
      const txHash = await promisify<string>(
        self.web3ContractInstance.methods.deleteCrucible(
          _address,
          _index,
        ).send, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return txHash;
    },
    async estimateGasAsync(
      _address: string,
      _index: BigNumber,
      txData: Tx = {},
    ): Promise<number> {
      const self = this as FoundryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const gas = await promisify<number>(
        self.web3ContractInstance.methods.deleteCrucible(
          _address,
          _index,
        ).estimateGas, self.web3ContractInstance,
      )(
        txDataWithDefaults,
      );
      return gas;
    },
    getABIEncodedTransactionData(
      _address: string,
      _index: BigNumber,
      txData: Tx = {},
    ): string {
      const self = this as FoundryContract;
      const abiEncodedTransactionData = self.web3ContractInstance.methods.deleteCrucible(
        _address,
        _index,
      ).encodeABI();
      return abiEncodedTransactionData;
    },
    async callAsync(
      _address: string,
      _index: BigNumber,
      txData: Tx = {},
    ): Promise<void
  > {
      const self = this as FoundryContract;
      const txDataWithDefaults = await self.applyDefaultsToTxDataAsync(
        txData,
      );
      const result = await promisify<void
  >(
        self.web3ContractInstance.methods.deleteCrucible(
          _address,
          _index,
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
  static async deployed(web3: Web3, defaults: Tx): Promise<FoundryContract> {
    const web3Utils = new Web3Utils(web3);
    const currentNetwork = await web3Utils.getNetworkIdAsync();
    const { abi, networks }: { abi: any[]; networks: any } = ContractArtifacts;
    const web3ContractInstance = new web3.eth.Contract(abi, networks[currentNetwork].address);

    return new FoundryContract(web3ContractInstance, defaults);
  }
  static async at(
    address: string,
    web3: Web3,
    defaults: Tx,
  ): Promise<FoundryContract> {
    const { abi }: { abi: any[] } = ContractArtifacts;
    const web3Utils = new Web3Utils(web3);
    const contractExists = await web3Utils.doesContractExistAtAddressAsync(address);
    const currentNetwork = await web3Utils.getNetworkIdAsync();

    if (contractExists) {
      const web3ContractInstance = new web3.eth.Contract(abi, address);

      return new FoundryContract(web3ContractInstance, defaults);
    } else {
      throw new Error(
        CONTRACT_WRAPPER_ERRORS.CONTRACT_NOT_FOUND_ON_NETWORK('Foundry', currentNetwork),
      );
    }
  }
  constructor(web3ContractInstance: Contract, defaults: Tx) {
    super(web3ContractInstance, defaults);
    classUtils.bindAll(this, ['web3ContractInstance', 'defaults']);
  }
} // tslint:disable:max-file-line-count
