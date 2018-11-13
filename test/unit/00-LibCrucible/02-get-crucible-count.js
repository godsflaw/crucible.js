import test from 'ava';

const LibCrucible = require('../../../').default;
const Address = require('../../fixtures/address');
const config = require('../../fixtures/config');

test.beforeEach(async t => {
  t.context.address = new Address();
  t.context.provider = require('../../fixtures/provider');
  t.context.libCrucible = new LibCrucible(t.context.provider, config);
});

test.afterEach(async t => {
  t.context.libCrucible.web3.setProvider(null);
  t.context.provider.engine.stop();
});

test('returns correct amount of crucibles', async t => {
  var libCrucible = t.context.libCrucible;

  try {
    var count = await libCrucible.getCrucibleCount();
    t.is(count, '0');
  } catch (err) {
    t.fail(err.message);
  }
});
