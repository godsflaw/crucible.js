"use strict";

const BigNumber = require('bignumber.js');
const Web3 = require('web3');
const Address = require('./address');

const GoalState = Object.freeze({
  'WAITING':1,
  'PASS':2,
  'FAIL':3,
});

const CrucibleState = Object.freeze({
  'OPEN':1,
  'LOCKED':2,
  'JUDGEMENT':3,
  'FINISHED':4,
  'PAID':5,
  'BROKEN':6,
  'KILLED':7,
});

function CrucibleUtils(options) {
  if (false === (this instanceof CrucibleUtils)) {
   return new CrucibleUtils(options);
  }

  options = options || {};

  if (options.libCrucible === undefined) {
    throw new Error('CrucibleUtils missing options.libCrucible');
  }

  this.libCrucible = options.libCrucible;

  this.web3 = this.libCrucible.web3;

  this.address = options.address || new Address();
  this.gasPrice = options.gasPrice || 100000000000;
  this.txGasCostBase = options.txGasCostBase || 2100000000000000;
  this.gasScale = options.gasScale || 100000000000;
  this.gasStipend = options.gasStipend || 2300;
  this.timeout = options.timeout || 691200;
  this.feeNumerator = options.feeNumerator || 100;

  this.zeroAmountWei = this.web3.utils.toWei('0', 'ether');
  this.zeroAmountEth = this.web3.utils.fromWei(this.zeroAmountWei, 'ether');

  this.tooLowAmountWei = this.web3.utils.toWei('0.01', 'ether');
  this.tooLowAmountEth = this.web3.utils.fromWei(this.tooLowAmountWei, 'ether');

  this.minAmountWei = this.web3.utils.toWei('0.25', 'ether');
  this.minAmountEth = this.web3.utils.fromWei(this.minAmountWei, 'ether');

  this.riskAmountWei = this.web3.utils.toWei('0.5', 'ether');
  this.riskAmountEth = this.web3.utils.fromWei(this.riskAmountWei, 'ether');

  this.txOpts = options.txOpts || {
    from: this.address.oracle,
    gas: 4000000,
    gasPrice: this.gasPrice,
  };
}

CrucibleUtils.prototype.sleep = require('util').promisify(setTimeout);

CrucibleUtils.prototype.addDays = function (date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

CrucibleUtils.prototype.addSeconds = function (date, seconds) {
  const result = new Date(date);
  result.setTime(result.getTime() + (seconds * 1000));
  return result;
};

// default: now
CrucibleUtils.prototype.startDate = function (secondsFromNow) {
  if (secondsFromNow === undefined) { secondsFromNow = (86400 * 0) }
  return Math.floor(this.addSeconds(Date.now(), secondsFromNow) / 1000);
};

// default: 1 day from now
CrucibleUtils.prototype.lockDate = function (secondsFromNow) {
  if (secondsFromNow === undefined) { secondsFromNow = (86400 * 1) }
  return Math.floor(this.addSeconds(Date.now(), secondsFromNow) / 1000);
};

// default: 8 days from now
CrucibleUtils.prototype.endDate = function (secondsFromNow) {
  if (secondsFromNow === undefined) { secondsFromNow = (86400 * 8) }
  return Math.floor(this.addSeconds(Date.now(), secondsFromNow) / 1000);
};

CrucibleUtils.prototype.getGoalState = function (_state) {
  let state;

  switch(_state.toNumber()) {
    case 1:
      state = GoalState.PASS;
      break;
    case 2:
      state = GoalState.FAIL;
      break;
    default:
      state = GoalState.WAITING;
  }

  return state;
};

CrucibleUtils.prototype.goalStateIsWaiting = function (state) {
  if (this.getGoalState(state) === GoalState.WAITING) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.goalStateIsPass = function (state) {
  if (this.getGoalState(state) === GoalState.PASS) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.goalStateIsFail = function (state) {
  if (this.getGoalState(state) === GoalState.FAIL) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.getCrucibleState = function (_state) {
  let state;

  switch(_state.toNumber()) {
    case 1:
      state = CrucibleState.LOCKED;
      break;
    case 2:
      state = CrucibleState.JUDGEMENT;
      break;
    case 3:
      state = CrucibleState.FINISHED;
      break;
    case 4:
      state = CrucibleState.PAID;
      break;
    case 5:
      state = CrucibleState.BROKEN;
      break;
    case 6:
      state = CrucibleState.KILLED;
      break;
    default:
      state = CrucibleState.OPEN;
  }

  return state;
};

CrucibleUtils.prototype.crucibleStateIsOpen = function (state) {
  if (this.getCrucibleState(state) === CrucibleState.OPEN) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.crucibleStateIsLocked = function (state) {
  if (this.getCrucibleState(state) === CrucibleState.LOCKED) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.crucibleStateIsJudgement = function (state) {
  if (this.getCrucibleState(state) === CrucibleState.JUDGEMENT) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.crucibleStateIsFinished = function (state) {
  if (this.getCrucibleState(state) === CrucibleState.FINISHED) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.crucibleStateIsPaid = function (state) {
  if (this.getCrucibleState(state) === CrucibleState.PAID) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.crucibleStateIsBroken = function (state) {
  if (this.getCrucibleState(state) === CrucibleState.BROKEN) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.crucibleStateIsKilled = function (state) {
  if (this.getCrucibleState(state) === CrucibleState.KILLED) {
    return true;
  }

  return false;
};

CrucibleUtils.prototype.gasCost = async function (_tx) {
  let tx = _tx;

  if (tx.gasUsed === undefined) {
    tx = await this.web3.eth.getTransactionReceipt(_tx);
  }

  return (this.gasPrice * tx.gasUsed);
};

// if we can't find an existing crucible to load, create one
CrucibleUtils.prototype.loadOrCreateCrucible = async function (context) {
  const crucibleCount = await context.libCrucible.getCrucibleCount();
  if (crucibleCount.eq(0)) {
    const txHash = await context.libCrucible.createCrucible(
      context.address.oracle,
      context.address.empty,
      context.cu.startDate(),
      context.cu.lockDate(),
      context.cu.endDate(),
      context.cu.minAmountWei,
      context.cu.timeout,
      context.cu.feeNumerator,
      context.cu.txOpts
    );
    await context.libCrucible.loadCrucibleFromCreateTxHash(txHash);
  } else {
    await context.libCrucible.loadCrucibleFromIndex(new BigNumber(0));
  }
};

module.exports = CrucibleUtils;
