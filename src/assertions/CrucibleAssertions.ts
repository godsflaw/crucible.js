'use strict';

import Web3 from 'web3';

import { Address, Commitment, CrucibleState, GoalState } from '../types/common';
import { CrucibleContract } from '../types/generated';
import { NULL_ADDRESS } from '../constants';
import { crucibleAssertionErrors } from '../errors';
import {
  BigNumber,
  crucibleNumberToGoal,
  crucibleNumberToState,
  crucibleStateToString,
  goalStateToString,
  now
} from '../util';

/**
 * @title  CrucibleAssertions
 * @author Christopher Mooney
 *
 * This interface should provide the client with a clear assertion failure
 * without having to send the transaction to the blockchain and have the throw
 * come out-of-band from conrol flow.  Basically, we will try to put all
 * possible assertion errors in here and catch them before sending anything to
 * the chain.
 */
export class CrucibleAssertions {
  private web3: Web3;

  constructor(web3: Web3) {
    this.web3 = web3;
  }

  /**
   * Throws if the given contract address does not respond to some methods from
   * the crucible interface
   */
  public async implementsCrucible(crucibleAddress: Address): Promise<void> {
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    try {
      // We probably don't want too many calls here, but enough to know we
      // are working with the correct contract.
      await Promise.all([
        crucibleContract.startDate.callAsync(),
        crucibleContract.lockDate.callAsync(),
        crucibleContract.minimumAmount.callAsync(),
        crucibleContract.endDate.callAsync(),
      ]);
    } catch (error) {
      throw new Error(
        crucibleAssertionErrors.MISSING_CRUCIBLE_METHOD(crucibleAddress)
      );
    }
  }

  public async hasValidOwnerAsync(
    crucibleAddress: Address,
    fromAddress: Address
  ): Promise<void> {
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const owner = await crucibleContract.owner.callAsync();

    if (fromAddress.toLowerCase() !== owner.toLowerCase()) {
      throw new Error(crucibleAssertionErrors.ONLY_OWNER(
        owner, fromAddress
      ));
    }
  }

  public async hasValidRiskAmountAsync(
    crucibleAddress: Address,
    riskAmount: BigNumber
  ): Promise<void> {
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const minimumAmount = await crucibleContract.minimumAmount.callAsync();

    if (riskAmount.lt(minimumAmount)) {
      throw new Error(crucibleAssertionErrors.RISK_AMOUNT_TOO_LOW(
        minimumAmount,
        riskAmount,
      ));
    }
  }

  public async participantDoesNotExistsAsync(
    crucibleAddress: Address,
    participantAddress: Address
  ): Promise<void> {
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const participantExists =
      await crucibleContract.participantExists.callAsync(participantAddress);

    if (participantExists) {
      throw new Error(crucibleAssertionErrors.PARTICIPANT_EXISTS(
        participantAddress
      ));
    }
  }

  public async participantExistsAsync(
    crucibleAddress: Address,
    participantAddress: Address
  ): Promise<void> {
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const participantExists =
      await crucibleContract.participantExists.callAsync(participantAddress);

    if (!participantExists) {
      throw new Error(crucibleAssertionErrors.PARTICIPANT_DOES_NOT_EXIST(
        participantAddress
      ));
    }
  }

  public async participantIsWaitingAsync(
    crucibleAddress: Address,
    participantAddress: Address
  ): Promise<void> {
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const result =
      await crucibleContract.commitments.callAsync(participantAddress);

    let commitment: Commitment = {
      exists: result[0],
      amount: result[1],
      metGoal: crucibleNumberToGoal(result[2])
    };

    if (commitment.metGoal !== GoalState.WAITING) {
      throw new Error(crucibleAssertionErrors.PARTICIPANT_NOT_WAITING(
        participantAddress,
        goalStateToString(commitment.metGoal),
      ));
    }
  }

  public async inState(
    crucibleAddress: Address,
    state: CrucibleState
  ): Promise<void> {
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const currentState = await crucibleContract.state.callAsync();

    if (state !== crucibleNumberToState(currentState)) {
      throw new Error(crucibleAssertionErrors.STATE_MISMATCH(
        crucibleStateToString(state),
        crucibleStateToString(crucibleNumberToState(currentState)),
      ));
    }
  }

  public async inEitherState(
    crucibleAddress: Address,
    states: CrucibleState[]
  ): Promise<void> {
    let statesString: string = '';
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const currentState = await crucibleContract.state.callAsync();

    for (let i = 0; i < states.length; i++) {
      if (states[i] === crucibleNumberToState(currentState)) {
        return;
      }
      statesString += crucibleStateToString(states[i]) + ', ';
    }

    throw new Error(crucibleAssertionErrors.STATE_MISMATCH(
      statesString.trim().substr(0, statesString.length - 2),
      crucibleStateToString(crucibleNumberToState(currentState)),
    ));
  }

  public async pastLockTime(crucibleAddress: Address): Promise<void> {
    const rightNow = now();
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const lockDate = await crucibleContract.lockDate.callAsync();

    if (!lockDate.lte(rightNow)) {
      throw new Error(crucibleAssertionErrors.NOT_PAST_LOCK_TIME(
        rightNow, lockDate
      ));
    }
  }

  public async pastEndTime(crucibleAddress: Address): Promise<void> {
    const rightNow = now();
    const crucibleContract = await CrucibleContract.at(
      crucibleAddress, this.web3, {}
    );

    const endDate = await crucibleContract.endDate.callAsync();

    if (!endDate.lte(rightNow)) {
      throw new Error(crucibleAssertionErrors.NOT_PAST_END_TIME(
        rightNow, endDate
      ));
    }
  }

}
