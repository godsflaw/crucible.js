import test from 'ava';

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

test.serial('new crucible should not be able to find a participant', async t => {
  const libCrucible = t.context.libCrucible;
  const address = t.context.address;

  try {
    let exists = await libCrucible.participantExists(address.user1);
    t.falsy(exists, 'participant does not exist');
    exists = await libCrucible.participantExists(address.user2);
    t.falsy(exists, 'participant does not exist');
    exists = await libCrucible.participantExists(address.user3);
    t.falsy(exists, 'participant does not exist');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('crucible should have 1 participant after add', async t => {
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
    let exists = await libCrucible.participantExists(address.user1);
    t.truthy(exists, 'participant does exist');
    exists = await libCrucible.participantExists(address.user2);
    t.falsy(exists, 'participant does not exist');
    exists = await libCrucible.participantExists(address.user3);
    t.falsy(exists, 'participant does not exist');
  } catch (err) {
    t.fail(err.message);
  }
});

test.serial('crucible should have 2 participants after add', async t => {
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
    let exists = await libCrucible.participantExists(address.user1);
    t.truthy(exists, 'participant does exist');
    exists = await libCrucible.participantExists(address.user2);
    t.truthy(exists, 'participant does exist');
    exists = await libCrucible.participantExists(address.user3);
    t.falsy(exists, 'participant does not exist');
  } catch (err) {
    t.fail(err.message);
  }
});
