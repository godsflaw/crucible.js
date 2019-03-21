'use strict';

import { Address } from '../types/common';
import { BigNumber } from '../util';

export const crucibleAssertionErrors = {
  MISSING_CRUCIBLE_METHOD: (address: string) =>
    `Contract at ${address} does not implement the Crucible interface.`,

  NOT_PAST_END_TIME: (now: BigNumber, time: BigNumber) =>
    `Must be past ${time} to change state. It is currently ${now}.`,

  NOT_PAST_LOCK_TIME: (now: BigNumber, time: BigNumber) =>
    `Must be past ${time} to lock crucible. It is currently ${now}.`,

  ONLY_OWNER: (owner: Address, fromAddress: Address) =>
    `This function can only be called by the owner (${owner}), ` +
    `you passed: ${fromAddress}.`,

  PARTICIPANT_EXISTS: (participantAddress: Address) =>
    `Participant with address ${participantAddress} already exists.`,

  PARTICIPANT_DOES_NOT_EXIST: (participantAddress: Address) =>
    `Participant with address ${participantAddress} doesn't exist.`,

  PARTICIPANT_NOT_WAITING: (participantAddress: Address, goalState: string) =>
    `Participant with address ${participantAddress} already has goal set to ` +
    `${goalState}.`,

  RISK_AMOUNT_TOO_LOW: (minAmount: BigNumber, riskAmount: BigNumber) =>
    `Risked amount ${riskAmount} must be at least ${minAmount}.`,

  STATE_MISMATCH: (state: string, currentState: string) =>
    `The current state is ${currentState} but must be ${state}.`,
};
