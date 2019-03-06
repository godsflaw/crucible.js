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

  t.context.beforeCount = await t.context.libCrucible.getCrucibleCount();

  let txHash = await t.context.libCrucible.createCrucible(
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
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test.serial('deleteCrucibleFromFoundry needs a valid owner', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;
  const beforeCount = t.context.beforeCount;

  try {
    let afterCount = await libCrucible.getCrucibleCount();
    t.truthy(afterCount.isGreaterThan(beforeCount), 'crucible count grew');

    // Try to remove as the oracle, not the owner of the foundry
    await libCrucible.deleteCrucibleFromFoundry(
      libCrucible.crucible.address,
      cu.txOpts
    );
    t.fail('should not get here');
  } catch (err) {
    t.is(
      err.message.toLowerCase(),
      'this function can only be called by the owner (' + address.owner +
      '), you passed: ' + address.oracle + '.',
      'throws error'
    );
  }
});

test.serial('removes an existing crucible', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;
  const beforeCount = t.context.beforeCount;

  try {
    let afterCount = await libCrucible.getCrucibleCount();
    t.truthy(afterCount.isGreaterThan(beforeCount), 'crucible count grew');
    cu.txOpts.from = address.owner;
    cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
      address.owner
    );
    let txHash = await libCrucible.deleteCrucibleFromFoundry(
      libCrucible.crucible.address,
      cu.txOpts
    );
    t.regex(txHash, /^0x[0-9a-f]+/i, 'got a txHash');
    afterCount = await libCrucible.getCrucibleCount();
    t.truthy(afterCount.eq(beforeCount), 'crucible count shrunk');
  } catch (err) {
    t.fail(err.message);
  }
});
