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
    const txHash = await t.context.libCrucible.createCrucible(
      t.context.address.oracle,
      t.context.address.empty,
      t.context.cu.startDate(),
      t.context.cu.lockDate(),
      t.context.cu.endDate(),
      t.context.cu.minAmountWei,
      t.context.cu.timeout,
      t.context.cu.feeNumerator,
      t.context.cu.txOpts
    );
    await t.context.libCrucible.loadCrucibleFromCreateTxHash(txHash);
  } catch (err) {
    t.fail(err.message);
  }
});

test.after(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test.serial('new crucible should have 0 commitments', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    let commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(0)), 'there are no commitments yet');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('crucible should have 1 commitment after add', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.user1;
  cu.txOpts.value = cu.riskAmountWei;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.user1
  );

  try {
    await libCrucible.addCommitment(address.user1, cu.txOpts);
    let commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(1)), 'commitment count is correct');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('crucible should have 2 commitment after add', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.from = address.user2;
  cu.txOpts.value = cu.riskAmountWei;
  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.user2
  );

  try {
    await libCrucible.addCommitment(address.user2, cu.txOpts);
    let commitments = await libCrucible.getCommitmentCount();
    t.truthy(commitments.eq(new BigNumber(2)), 'commitment count is correct');
  } catch (err) {
    t.fail(err.message);
  }
});
