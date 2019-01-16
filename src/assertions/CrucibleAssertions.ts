'use strict';

import Web3 from 'web3';

import { Address } from '../types/common';
import { CrucibleContract } from '../types/generated';
import { NULL_ADDRESS } from '../constants';
import { crucibleAssertionErrors } from '../errors';
import { BigNumber } from '../util';

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
      await Promise.all([
        crucibleContract.startDate.callAsync(),
        // crucibleContract.penalty.callAsync(),
        // crucibleContract.feeDenominator.callAsync(),
        // crucibleContract.participants.callAsync('0'),
        // crucibleContract.beneficiary.callAsync(),
        // crucibleContract.version.callAsync(),
        // crucibleContract.penaltyPaid.callAsync(),
        // crucibleContract.lockDate.callAsync(),
        // crucibleContract.timeout.callAsync(),
        // crucibleContract.passCount.callAsync(),
        // crucibleContract.owner.callAsync(),
        // crucibleContract.released.callAsync(),
        // crucibleContract.feePaid.callAsync(),
        // crucibleContract.minimumAmount.callAsync(),
        // crucibleContract.trackingBalance.callAsync(),
        // crucibleContract.state.callAsync(),
        // crucibleContract.endDate.callAsync(),
        // crucibleContract.reserve.callAsync(),
        // crucibleContract.fee.callAsync(),
        // crucibleContract.calculateFee.callAsync(),
        // crucibleContract.feeNumerator.callAsync(),
        // crucibleContract.commitments.callAsync('0'),
        // crucibleContract.count.callAsync(),
        // crucibleContract.participantExists.callAsync(NULL_ADDRESS),
      ]);
    } catch (error) {
      throw new Error(
        crucibleAssertionErrors.MISSING_CRUCIBLE_METHOD(crucibleAddress)
      );
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

}
