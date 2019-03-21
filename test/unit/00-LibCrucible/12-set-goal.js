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
    let commitAmount =
      await t.context.libCrucible.getCommitAmount(t.context.address.user1);
    t.deepEqual(
      commitAmount, t.context.cu.riskAmountWei, 'commit amount correct'
    );

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
    commitAmount =
      await t.context.libCrucible.getCommitAmount(t.context.address.user2);
    t.deepEqual(
      commitAmount, t.context.cu.riskAmountWei, 'commit amount correct'
    );

    t.context.cu.txOpts.value = undefined;
    t.context.cu.txOpts.from = t.context.address.oracle;
    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.oracle
      );
  } catch (err) {
    t.fail(err.message);
  }
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test.serial('toss error if setting a goal for a non-existant participant', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  await cu.sleep(1000);
  let txHash = await libCrucible.lock(cu.txOpts);
  await libCrucible.waitForTxToComplete(txHash);

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    let state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');
    await libCrucible.setGoal(address.user3, true, cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message,
      'Participant with address ' + address.user3 + ' doesn\'t exist.',
      'throws error'
    );
  }
});

test.serial('can setGoal in the locked and judgement state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  await cu.sleep(1000);
  let txHash = await libCrucible.lock(cu.txOpts);
  await libCrucible.waitForTxToComplete(txHash);

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    // check crucible state
    let state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');

    // check and set goal for user1
    let goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'WAITING', 'got the correct goal');
    txHash = await libCrucible.setGoal(address.user1, false, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'FAIL', 'got the correct goal');

    // change and check crucible state
    await cu.sleep(5000);
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.oracle
    );
    txHash = await libCrucible.judgement(cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    state = await libCrucible.getState();
    t.is(state, 'JUDGEMENT', 'got the correct state');

    // check and set goal for user2
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.oracle
    );
    goal = await libCrucible.getGoalState(address.user2);
    t.is(goal, 'WAITING', 'got the correct goal');
    txHash = await libCrucible.setGoal(address.user2, true, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    goal = await libCrucible.getGoalState(address.user2);
    t.is(goal, 'PASS', 'got the correct goal');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('setState should toss error if goal is already set', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  await cu.sleep(1000);
  let txHash = await libCrucible.lock(cu.txOpts);
  await libCrucible.waitForTxToComplete(txHash);

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    // check crucible state
    let state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');

    // check and set goal for user1
    let goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'WAITING', 'got the correct goal');
    txHash = await libCrucible.setGoal(address.user1, false, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'FAIL', 'got the correct goal');

    // check and set goal for user1 again (should fail)
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.oracle
    );
    goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'FAIL', 'got the correct goal');
    txHash = await libCrucible.setGoal(address.user1, true, cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message,
      'Participant with address ' + address.user1 + ' already has goal ' +
      'set to FAIL.',
      'throws error'
    );
  }
});

test.serial('setState should toss error if not called by owner', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  await cu.sleep(1000);
  let txHash = await libCrucible.lock(cu.txOpts);
  await libCrucible.waitForTxToComplete(txHash);

  cu.txOpts.from = address.user1;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.user1
  );

  try {
    // check crucible state
    let state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'got the correct state');

    // check and set goal for user1
    let goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'WAITING', 'got the correct goal');
    await libCrucible.setGoal(address.user1, true, cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message.toLowerCase(),
      'this function can only be called by the owner (' +
      address.oracle + '), you passed: ' + address.user1 + '.',
      'throws error'
    );
  }
});

test.serial('setState should error if crucible in wrong state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    // check crucible state
    let state = await libCrucible.getState();
    t.is(state, 'OPEN', 'got the correct state');

    // check and set goal for user1
    let goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'WAITING', 'got the correct goal');
    await libCrucible.setGoal(address.user1, true, cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message,
      'The current state is OPEN but must be LOCKED, JUDGEMENT.',
      'throws error'
    );
  }
});
