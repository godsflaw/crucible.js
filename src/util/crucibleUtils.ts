import { BigNumber } from '../util';
import { CrucibleState, GoalState } from '../types/common';

export function crucibleNumberToGoal(state: BigNumber): GoalState {
  let result: GoalState;

  // Very odd, when this metGoal value comes back it is a BigNumber, but
  // the actual format is a string if 0, 1, or 2 representing the state.
  // This doesn't happen in the case of crucibleNumberToState().  The only
  // difference is that, while both are enums in solidity, the state of the
  // crucible comes back directly and the goal state is part of an array.
  if (typeof state === 'string') {
    state = new BigNumber(state);
  }

  switch (state.toNumber()) {
    case 1:
      result = GoalState.PASS;
      break;
    case 2:
      result = GoalState.FAIL;
      break;
    default:
      result = GoalState.WAITING;
  }

  return result;
}

export function goalStateToString(state: GoalState): string {
  let goalStr: string;

  switch (state) {
    case GoalState.PASS:
      goalStr = 'PASS';
      break;
    case GoalState.FAIL:
      goalStr = 'FAIL';
      break;
    default:
      goalStr = 'WAITING';
  }

  return goalStr;
}

export function crucibleStateToString(state: CrucibleState): string {
  let stateStr: string;

  switch (state) {
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

  switch (state.toNumber()) {
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
