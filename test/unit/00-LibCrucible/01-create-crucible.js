import test from 'ava';

const BigNumber = require('bignumber.js');
const LibCrucible = require('../../../').default;
const Address = require('../../fixtures/address');
const config = require('../../fixtures/config');
const CrucibleUtils = require('../../fixtures/crucible-utils');

test.beforeEach(async t => {
  t.context.address = new Address();
  t.context.provider = require('../../fixtures/provider');
  t.context.libCrucible = new LibCrucible(t.context.provider, config);
  t.context.cu = new CrucibleUtils({libCrucible: t.context.libCrucible});

  t.context.cu.txOpts.nonce =
    await t.context.libCrucible.web3.eth.getTransactionCount(
      t.context.address.oracle
    );
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test.serial('crucible has 0 commitments', async t => {
  const libCrucible = t.context.libCrucible;
  const address = t.context.address;
  const cu = t.context.cu;

  try {
    const txHash = await libCrucible.createCrucible(
      address.oracle,
      address.empty,
      cu.startDate(),
      cu.lockDate(),
      cu.endDate(),
      cu.minAmountWei,
      cu.timeout,
      cu.feeNumerator,
      cu.txOpts
    );
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    const commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.isEqualTo(0), 'there are no commitments yet');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('new crucible startDate must be < lockDate', async t => {
  const libCrucible = t.context.libCrucible;
  const address = t.context.address;
  const cu = t.context.cu;
  const startDate = cu.startDate();
  const lockDate = new BigNumber(0);
  const endDate = cu.endDate();

  try {
    const txHash = await libCrucible.createCrucible(
      address.oracle,
      address.empty,
      startDate,
      lockDate,
      endDate,
      cu.minAmountWei,
      cu.timeout,
      cu.feeNumerator,
      cu.txOpts
    );
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    t.fail('should not get here');
  } catch (err) {
    t.is(
      err.message,
      'startDate (' + startDate + ') must be less than lockDate (0).',
      'throws error'
    );
  }
});

test.serial('new crucible lockDate must be < endDate', async t => {
  const libCrucible = t.context.libCrucible;
  const address = t.context.address;
  const cu = t.context.cu;
  const startDate = cu.startDate();
  const lockDate = cu.lockDate();
  const endDate = new BigNumber(0);

  try {
    const txHash = await libCrucible.createCrucible(
      address.oracle,
      address.empty,
      startDate,
      lockDate,
      endDate,
      cu.minAmountWei,
      cu.timeout,
      cu.feeNumerator,
      cu.txOpts
    );
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    t.fail('should not get here');
  } catch (err) {
    t.is(
      err.message,
      'lockDate (' + lockDate + ') must be less than endDate (0).',
      'throws error'
    );
  }
});

test.serial('new crucible timeout must be > (endDate - startDate)', async t => {
  const libCrucible = t.context.libCrucible;
  const address = t.context.address;
  const cu = t.context.cu;
  const startDate = cu.startDate();
  const lockDate = cu.lockDate();
  const endDate = cu.endDate();

  try {
    const txHash = await libCrucible.createCrucible(
      address.oracle,
      address.empty,
      startDate,
      lockDate,
      endDate,
      cu.minAmountWei,
      new BigNumber(1),
      cu.feeNumerator,
      cu.txOpts
    );
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    t.fail('should not get here');
  } catch (err) {
    t.is(
      err.message,
      'timeout (1) must be greater than or equal to the number of seconds ' +
      'between startDate and endDate (' + endDate.minus(startDate) + ').',
      'throws error'
    );
  }
});

test.serial('new crucible cannot be created with 0 minimumAmount', async t => {
  const libCrucible = t.context.libCrucible;
  const address = t.context.address;
  const cu = t.context.cu;

  try {
    const txHash = await libCrucible.createCrucible(
      address.oracle,
      address.empty,
      cu.startDate(),
      cu.lockDate(),
      cu.endDate(),
      new BigNumber(0),
      cu.timeout,
      cu.feeNumerator,
      cu.txOpts
    );
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    t.fail('should not get here');
  } catch (err) {
    t.is(err.message, 'minAmount must be greater than 0.', 'throws error');
  }
});
