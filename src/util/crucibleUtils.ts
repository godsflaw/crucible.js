import { BigNumber } from '../util';
import { CrucibleState } from '../types/common';

export function crucibleStateToString(state: CrucibleState): string {
  let stateStr: string;

  switch(state) {
    case CrucibleState.LOCKED:
      stateStr = 'LOCKED';
      break;
    case CrucibleState.JUDGEMENT:
      stateStr = 'JUDGEMENT';
      break;
    case CrucibleState.FINISHED:
      stateStr = 'FINISHED';
      break;
    case CrucibleState.PAID:
      stateStr = 'PAID';
      break;
    case CrucibleState.BROKEN:
      stateStr = 'BROKEN';
      break;
    case CrucibleState.KILLED:
      stateStr = 'KILLED';
      break;
    default:
      stateStr = 'OPEN';
  }

  return stateStr;
}

export function crucibleNumberToState(state: BigNumber): CrucibleState {
  let result: CrucibleState;

  switch(state.toNumber()) {
    case 1:
      result = CrucibleState.LOCKED;
      break;
    case 2:
      result = CrucibleState.JUDGEMENT;
      break;
    case 3:
      result = CrucibleState.FINISHED;
      break;
    case 4:
      result = CrucibleState.PAID;
      break;
    case 5:
      result = CrucibleState.BROKEN;
      break;
    case 6:
      result = CrucibleState.KILLED;
      break;
    default:
      result = CrucibleState.OPEN;
  }

  return result;
}

export function now(): BigNumber {
  return new BigNumber(Math.floor(Date.now() / 1000));
}
