'use strict';

import { Address } from '../types/common';
import { BigNumber } from '../util';

export const crucibleAssertionErrors = {
  MISSING_CRUCIBLE_METHOD: (address: string) =>
    `Contract at ${address} does not implement the Crucible interface.`,

  NOT_PAST_LOCK_DATE: (now: BigNumber, lockDate: BigNumber) =>
    `Must be past ${lockDate} to lock crucible. It is currently ${now}.`,

  PARTICIPANT_EXISTS: (participantAddress: Address) =>
    `Participant with address ${participantAddress} already exists.`,

  RISK_AMOUNT_TOO_LOW: (minAmount: BigNumber, riskAmount: BigNumber) =>
    `Risked amount ${riskAmount} must be at least ${minAmount}.`,

  STATE_MISMATCH: (state: string, currentState: string) =>
    `The current state is ${currentState} but must be ${state}.`,
};
