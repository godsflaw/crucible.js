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
    t.context.txHash = await t.context.libCrucible.createCrucible(
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
  } catch (err) {
    t.fail(err.message);
  }
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test('can load the crucible from the create transaction hash', async t => {
  const libCrucible = t.context.libCrucible;
  const txHash = t.context.txHash;

  try {
    t.falsy(libCrucible.crucible, 'crucible is not defined yet');
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    t.truthy(libCrucible.crucible, 'crucible is defined');
  } catch (err) {
    t.fail(err.message);
  }
});
