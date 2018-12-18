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
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test('removes an existing crucible', async t => {
  const libCrucible = t.context.libCrucible;
  const cu = t.context.cu;
  const address = t.context.address;

  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    let beforeCount = await libCrucible.getCrucibleCount();
    let txHash = await libCrucible.createCrucible(
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
    t.regex(txHash, /^0x[0-9a-f]+/i, 'got a txHash');
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    let afterCount = await libCrucible.getCrucibleCount();
    t.truthy(afterCount.isGreaterThan(beforeCount), 'crucible count grew');
    cu.txOpts.from = address.owner;
    txHash = await libCrucible.deleteCrucibleFromFoundry(
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
