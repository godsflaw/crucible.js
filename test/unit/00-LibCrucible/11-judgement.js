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
    let txHash = await t.context.libCrucible.createCrucible(
      t.context.address.oracle,
      t.context.address.empty,
      t.context.cu.startDate(),
      t.context.cu.lockDate(1),
      t.context.cu.endDate(5),
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
    txHash = await t.context.libCrucible.waitForTxToComplete(txHash);

    // add participant user2
    t.context.cu.txOpts.from = t.context.address.user2;
    t.context.cu.txOpts.value = t.context.cu.riskAmountWei;
    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.user2
      );
    txHash = await t.context.libCrucible.addCommitment(
      t.context.address.user2, t.context.cu.txOpts
    );
    await t.context.libCrucible.waitForTxToComplete(txHash);

    t.context.cu.txOpts.value = undefined;
    t.context.cu.txOpts.from = t.context.address.oracle;
    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.oracle
      );

    await t.context.cu.sleep(1000);
    txHash = await t.context.libCrucible.lock(t.context.cu.txOpts);
    await t.context.libCrucible.waitForTxToComplete(txHash);
  } catch (err) {
    t.fail(err.message);
  }
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test.serial('toss error if calling judgement lock before endDate', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    let state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');
    await libCrucible.judgement(cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.regex(
      err.message,
      /Must be past [0-9]+ to change state\. It is currently [0-9]+\./i,
      'throws error'
    );
  }
});

test.serial('move crucible into the judgement state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  await cu.sleep(5000);

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    let state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');
    const txHash = await libCrucible.judgement(cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    state = await libCrucible.getState();
    t.is(state, 'JUDGEMENT', 'got the correct state');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('in JUDGEMENT state, judgement() should throw error', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  await cu.sleep(5000);

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    let state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');
    const txHash = await libCrucible.judgement(cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    state = await libCrucible.getState();
    t.is(state, 'JUDGEMENT', 'got the correct state');
    await libCrucible.judgement(cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.regex(
      err.message,
      /The current state is JUDGEMENT but must be LOCKED\./i,
      'throws error'
    );
  }
});
