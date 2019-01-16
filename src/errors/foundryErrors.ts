'use strict';

import { Address } from '../types/common';
import { BigNumber } from '../util';

export const foundryAssertionErrors = {
  MISSING_FOUNDRY_METHOD: (address: string) =>
    `Contract at ${address} does not implement the Foundry interface.`,
};
