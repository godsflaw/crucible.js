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

  await t.context.cu.loadOrCreateCrucible(t.context);
  t.context.crucibleAddress = t.context.libCrucible.crucible.address;
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test('can load crucible from an address', async t => {
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
