import test from 'ava';

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

  try {
    const txHash = await t.context.libCrucible.createCrucible(
      t.context.address.oracle,
      t.context.address.empty,
      t.context.cu.startDate(),
      t.context.cu.lockDate(5),
      t.context.cu.endDate(),
      t.context.cu.minAmountWei,
      t.context.cu.timeout,
      t.context.cu.feeNumerator,
      t.context.cu.txOpts
    );
    await t.context.libCrucible.loadCrucibleFromCreateTxHash(txHash);

    // add participant user1
    t.context.cu.txOpts.from = t.context.address.user1;
    t.context.cu.txOpts.value = t.context.cu.riskAmountWei;
    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.user1
      );
    await t.context.libCrucible.addCommitment(
      t.context.address.user1, t.context.cu.txOpts
    );

    // add participant user2
    t.context.cu.txOpts.from = t.context.address.user2;
    t.context.cu.txOpts.value = t.context.cu.riskAmountWei;
    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.user2
      );
    await t.context.libCrucible.addCommitment(
      t.context.address.user2, t.context.cu.txOpts
    );

    t.context.cu.txOpts.value = undefined;
  } catch (err) {
    t.fail(err.message);
  }
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test.serial('should toss error if we try to lock before lockDate', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    let state = await libCrucible.getState();
    t.is(state, 'OPEN', 'got the correct state');
    await libCrucible.lock(cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.regex(
      err.message,
      /Must be past [0-9]+ to lock crucible\. It is currently [0-9]+\./i,
      'throws error'
    );
  }
});

test.serial('move crucible into the locked state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  await cu.sleep(6000);

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    let state = await libCrucible.getState();
    t.is(state, 'OPEN', 'got the correct state');
    const txHash = await libCrucible.lock(cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('already in LOCKED state, lock() should throw error', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  await cu.sleep(6000);

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    let state = await libCrucible.getState();
    t.is(state, 'OPEN', 'got the correct state');
    const txHash = await libCrucible.lock(cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');
    await libCrucible.lock(cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.regex(
      err.message,
      /The current state is LOCKED but must be OPEN\./i,
      'throws error'
    );
  }
});
