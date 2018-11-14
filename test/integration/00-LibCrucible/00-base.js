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

test('new LibCrucibe is an object', async t => {
  var libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible, 'object');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has getCrucibleCount', async t => {
  var libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.getCrucibleCount, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});
