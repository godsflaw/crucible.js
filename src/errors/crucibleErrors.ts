'use strict';

import { Address } from '../types/common';
import { BigNumber } from '../util';

export const crucibleAssertionErrors = {
  MISSING_CRUCIBLE_METHOD: (address: string) =>
    `Contract at ${address} does not implement the Crucible interface.`,
  RISK_AMOUNT_TOO_LOW: (minAmount: BigNumber, riskAmount: BigNumber) =>
    `risked amount ${riskAmount} must be at least ${minAmount}`,
};
