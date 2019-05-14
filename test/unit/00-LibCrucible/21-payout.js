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

  try {
    let txHash = await t.context.libCrucible.createCrucible(
      t.context.address.oracle,
      t.context.address.empty,
      t.context.cu.startDate(),
      t.context.cu.lockDate(1),
      t.context.cu.endDate(2),
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

    await t.context.cu.sleep(1000);
    txHash = await t.context.libCrucible.lock(t.context.cu.txOpts);
    await t.context.libCrucible.waitForTxToComplete(txHash);

    // set goal for user1 and user2
    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.oracle
      );
    txHash = await t.context.libCrucible.setGoal(
      t.context.address.user1, false, t.context.cu.txOpts
    );
    await t.context.libCrucible.waitForTxToComplete(txHash);
    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.oracle
      );
    txHash = await t.context.libCrucible.setGoal(
      t.context.address.user2, true, t.context.cu.txOpts
    );
    await t.context.libCrucible.waitForTxToComplete(txHash);

    await t.context.cu.sleep(1000);
    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.oracle
      );
    txHash = await t.context.libCrucible.judgement(t.context.cu.txOpts);
    await t.context.libCrucible.waitForTxToComplete(txHash);

    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.oracle
      );
    txHash = await t.context.libCrucible.finish(t.context.cu.txOpts);
    await t.context.libCrucible.waitForTxToComplete(txHash);

    t.context.cu.txOpts.nonce =
      await t.context.libCrucible.web3.eth.getTransactionCount(
        t.context.address.oracle
      );
    txHash = await t.context.libCrucible.collectFee(
      t.context.address.oracle,
      t.context.cu.txOpts
    );
    await t.context.libCrucible.waitForTxToComplete(txHash);

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

test.serial('payout() called by oracle on user1', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  const user1StartBalance = new BigNumber(
    await libCrucible.web3.eth.getBalance(address.user1)
  );

  try {
    // check crucible state
    let state = await libCrucible.getState();
    t.is(state, 'FINISHED', 'got the correct state');

    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.oracle
    );
    let txHash = await libCrucible.payout(address.user1, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);

    const user1Balance = new BigNumber(
      await libCrucible.web3.eth.getBalance(address.user1)
    );

    t.true(user1Balance.eq(user1StartBalance), 'balance the same');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('payout() called by user2 pays user2', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  const user2StartBalance = new BigNumber(
    await libCrucible.web3.eth.getBalance(address.user2)
  );

  try {
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.user2
    );
    cu.txOpts.from = address.user2;
    let txHash = await libCrucible.payout(address.user2, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);

    const user2Balance = new BigNumber(
      await libCrucible.web3.eth.getBalance(address.user2)
    );

    t.true(user2Balance.gt(user2StartBalance), 'balance increased');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('tosses error if payout() called with non-participant', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  try {
    cu.txOpts.from = address.user3;
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.user3
    );
    let txHash = await libCrucible.payout(address.user3, cu.txOpts);
    await libCrucible.waitForTxToComplete(txHash);
    t.fail('should have tossed an error');
  } catch (err) {
    t.is(
      err.message.toLowerCase(),
      'participant with address ' + address.user3 + ' doesn\'t exist.',
      'throws error'
    );
  }
});
