'use strict';

import { Address } from '../types/common';
import { BigNumber } from '../util';

export const foundryAssertionErrors = {
  HAS_CRUCIBLES: (address: Address) =>
    `Foundry contract at ${address} is not tracking any crucibles.`,

  INDEX_ADDRESS_ERROR: (
    index: BigNumber,
    addressAtIndex: Address,
    addressToDelete: Address
  ) =>
    `The address (${addressAtIndex}) at index ${index}, does not match the ` +
    `address to be deleted: ${addressToDelete}.`,

  LOCK_END_DATE: (lockDate: BigNumber, endDate: BigNumber) =>
    `lockDate (${lockDate}) must be less than endDate (${endDate}).`,

  MINAMOUNT_ZERO: () => `minAmount must be greater than 0.`,

  MISSING_FOUNDRY_METHOD: (address: Address) =>
    `Contract at ${address} does not implement the Foundry interface.`,

  ONLY_OWNER: (owner: Address, fromAddress: Address) =>
    `This function can only be called by the owner (${owner}), ` +
    `you passed: ${fromAddress}.`,

  START_LOCK_DATE: (startDate: BigNumber, lockDate: BigNumber) =>
    `startDate (${startDate}) must be less than lockDate (${lockDate}).`,

  TIMEOUT_VALUE: (delta: BigNumber, timeout: BigNumber) =>
    `timeout (${timeout}) must be greater than or equal to the number of ` +
    `seconds between startDate and endDate (${delta}).`,
};
