'use strict';

import { Address } from '../types/common';
import { BigNumber } from '../util';

export const foundryAssertionErrors = {
  MISSING_FOUNDRY_METHOD: (address: Address) =>
    `Contract at ${address} does not implement the Foundry interface.`,
  ONLY_OWNER: (owner: Address, fromAddress: Address) =>
    `This function can only be called by the owner (${owner}), ` +
    `you passed: ${fromAddress}.`,
  HAS_CRUCIBLES: (address: Address) =>
    `Foundry contract at ${address} is not tracking any crucibles.`,
  INDEX_ADDRESS_ERROR:
    (index: BigNumber, addressAtIndex: Address, addressToDelete: Address) =>
    `The address (${addressAtIndex}) at index ${index}, does not match the ` +
    `address to be deleted: ${addressToDelete}.`,
};
