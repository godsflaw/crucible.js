import test from 'ava';

const BigNumber = require('bignumber.js');
const LibCrucible = require('../../../').default;
const Address = require('../../fixtures/address');
const config = require('../../fixtures/config');
const CrucibleUtils = require('../../fixtures/crucible-utils');

test.before(async t => {
  t.context.address = new Address();
  t.context.provider = require('../../fixtures/provider');
  t.context.libCrucible = new LibCrucible(t.context.provider, config);
  t.context.cu = new CrucibleUtils({libCrucible: t.context.libCrucible});

  t.context.cu.txOpts.nonce =
    await t.context.libCrucible.web3.eth.getTransactionCount(
      t.context.address.oracle
    );

  try {
    t.context.beforeCount = await t.context.libCrucible.getCrucibleCount();
    t.context.txHash = await t.context.libCrucible.createCrucible(
      t.context.address.oracle,
      t.context.address.empty,
      t.context.cu.startDate(),
      t.context.cu.lockDate(5),
      t.context.cu.endDate(10),
      t.context.cu.minAmountWei,
      t.context.cu.timeout,
      t.context.cu.feeNumerator,
      t.context.cu.txOpts
    );
    await t.context.libCrucible.loadCrucibleFromCreateTxHash(t.context.txHash);
    t.context.crucibleAddress = t.context.libCrucible.crucible.address;
    t.context.crucibleCount = await t.context.libCrucible.getCrucibleCount();
  } catch (err) {
    t.fail(err.message);
  }
});

test.after(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test.afterEach(async t => {
  t.context.cu.txOpts.value = undefined;
});

test.serial('can load the crucible from the create transaction hash', async t => {
  const libCrucible = new LibCrucible(t.context.provider, config);
  const txHash = t.context.txHash;

  try {
    t.falsy(libCrucible.crucible, 'crucible is not defined yet');
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    t.truthy(libCrucible.crucible, 'crucible is defined');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('can load crucible from an address', async t => {
  const libCrucible = new LibCrucible(t.context.provider, config);
  const crucibleAddress = t.context.crucibleAddress;

  try {
    t.falsy(libCrucible.crucible, 'crucible is not defined yet');
    await libCrucible.loadCrucibleFromAddress(crucibleAddress);
    t.truthy(libCrucible.crucible, 'crucible is defined');
    t.is(
      libCrucible.crucible.address, crucibleAddress, 'crucible address matches'
    );
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('can load crucible from an index', async t => {
  const libCrucible = new LibCrucible(t.context.provider, config);
  const crucibleAddress = t.context.crucibleAddress;

  try {
    t.falsy(libCrucible.crucible, 'crucible is not defined yet');
    await libCrucible.loadCrucibleFromIndex(t.context.crucibleCount - 1);
    t.truthy(libCrucible.crucible, 'crucible is defined');
    t.is(
      libCrucible.crucible.address, crucibleAddress, 'crucible address matches'
    );
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('foundry tracks crucibles correctly', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    const afterCount = await libCrucible.getCrucibleCount();
    t.truthy(
      afterCount.isGreaterThan(t.context.beforeCount), 'crucible count grew'
    );
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('new crucible should have 0 commitments', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    const commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(0)), 'there are no commitments yet');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('crucible should have 1 commitment after addCommitment', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.value = cu.riskAmountWei;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    const txHash = await libCrucible.addCommitment(address.user1, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    const commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(1)), 'commitment count is correct');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('crucible should have 2 commitments after addCommitment', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.value = cu.riskAmountWei;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    const txHash = await libCrucible.addCommitment(address.user2, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    const commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(2)), 'commitment count is correct');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('crucible should toss error if value is undefined', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.value = undefined;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    const txHash = await libCrucible.addCommitment(address.user3, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    t.fail('should have tossed an error');
  } catch (err) {
    t.pass(err.message);
    const commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(2)), 'commitment count is correct');
  }
});

test.serial('crucible should toss error if value is too low', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.value = cu.tooLowAmountWei;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    await libCrucible.addCommitment(address.user3, cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message,
      'Risked amount ' + cu.tooLowAmountWei + ' must be at least ' +
        cu.minAmountWei + '.',
      'got correct error message'
    );
    const commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(2)), 'commitment count is correct');
  }
});

test.serial('addCommitment should throw participantExists error', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.value = cu.riskAmountWei;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    await libCrucible.addCommitment(address.user1, cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message.toLowerCase(),
      'participant with address ' + address.user1 + ' already exists.',
      'got correct error message'
    );
    const commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(2)), 'commitment count is correct');
  }
});

test.serial('locks the crucible', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  try {
    // make sure we are past the time when we can lock the contract
    await cu.sleep(5000);
    cu.txOpts.from = address.oracle;
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.oracle
    );
    let state = await libCrucible.getState();
    t.is(state, 'OPEN', 'crucible state correct');
    const txHash = await libCrucible.lock();
    t.regex(txHash, /^0x[0-9a-f]+/i, 'got a txHash');
    await libCrucible.waitForTxToComplete(txHash);
    // really allow this transaction to move through the network 3s
    await cu.sleep(3000);
    state = await libCrucible.getState();
    t.is(state, 'LOCKED', 'crucible state correct');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('crucible should toss error if in LOCKED state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.value = cu.riskAmountWei;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    await libCrucible.addCommitment(address.user3, cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message,
      'The current state is LOCKED but must be OPEN.',
      'got correct error message'
    );
    const commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(2)), 'commitment count is correct');
  }
});

test.serial('toss error if setting a goal for a non-existant participant', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
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

test.serial('can setGoal in the locked state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    // check and set goal for user1
    let goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'WAITING', 'got the correct goal');
    const txHash = await libCrucible.setGoal(address.user1, false, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    goal = await libCrucible.getGoalState(address.user1);
    t.is(goal, 'FAIL', 'got the correct goal');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('can change state to judgement state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    // change and check crucible state
    await cu.sleep(5000);
    const txHash = await libCrucible.judgement(cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    const state = await libCrucible.getState();
    t.is(state, 'JUDGEMENT', 'got the correct state');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('can setGoal in the judgement state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    // check and set goal for user2
    let goal = await libCrucible.getGoalState(address.user2);
    t.is(goal, 'WAITING', 'got the correct goal');
    const txHash = await libCrucible.setGoal(address.user2, true, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    goal = await libCrucible.getGoalState(address.user2);
    t.is(goal, 'PASS', 'got the correct goal');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('tosses error if finish() called by non-owner', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  try {
    // check crucible state
    const state = await libCrucible.getState();
    t.is(state, 'JUDGEMENT', 'got the correct state');

    cu.txOpts.from = address.user2;
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.user2
    );
    await libCrucible.finish(cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message.toLowerCase(),
      'this function can only be called by the owner (' +
      address.oracle.toLowerCase() + '), you passed: ' + address.user2 + '.',
      'throws error'
    );
  }
});

test.serial('can change to FINISHED state', async t => {
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
    t.is(state, 'JUDGEMENT', 'got the correct state');

    const txHash = await libCrucible.finish(cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    state = await libCrucible.getState();
    t.is(state, 'FINISHED', 'got the correct state');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('tosses error if we are already in the FINISHED state', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.oracle;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    const state = await libCrucible.getState();
    t.is(state, 'FINISHED', 'got the correct state');
    await libCrucible.finish(cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message,
      'The current state is FINISHED but must be JUDGEMENT.',
      'throws error'
    );
  }
});

test.serial('tosses error if collectFee() called by non-owner', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  try {
    // check crucible state
    let state = await libCrucible.getState();
    t.is(state, 'FINISHED', 'got the correct state');

    cu.txOpts.from = address.user3;
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.user3
    );
    await libCrucible.collectFee(address.user3, cu.txOpts);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message.toLowerCase(),
      'this function can only be called by the owner (' +
      address.oracle.toLowerCase() + '), you passed: ' + address.user3 + '.',
      'throws error'
    );
  }
});

test.serial('collectFee() pays user3', async t => {
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
    t.is(state, 'FINISHED', 'got the correct state');

    const user3StartBalance = new BigNumber(
      await libCrucible.web3.eth.getBalance(address.user3)
    );

    const txHash = await libCrucible.collectFee(address.user3, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);

    const user3Balance = new BigNumber(
      await libCrucible.web3.eth.getBalance(address.user3)
    );

    t.true(user3Balance.gt(user3StartBalance), 'balance increased');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('removes an existing crucible from the foundry', async t => {
  const libCrucible = t.context.libCrucible;
  const crucibleAddress = t.context.crucibleAddress;
  const cu = t.context.cu;
  const address = t.context.address;

  try {
    const beforeCount = await libCrucible.getCrucibleCount();
    cu.txOpts.from = address.oracle;
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.oracle
    );
    const txHash = await libCrucible.deleteCrucibleFromFoundry(
      crucibleAddress, cu.txOpts
    );
    t.regex(txHash, /^0x[0-9a-f]+/i, 'got a txHash');
    await libCrucible.waitForTxToComplete(txHash);
    const afterCount = await libCrucible.getCrucibleCount();
    t.truthy(afterCount.lt(beforeCount), 'crucible count shrunk');
  } catch (err) {
    t.fail(err.message);
  }
});
