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

test('new LibCrucible is an object', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible, 'object');
  } catch (err) {
    t.fail(err.message);
  }
});

test('new LibCrucible has an undefined crucible', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(libCrucible.crucible, undefined, 'crucible is undefined');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has createCrucible', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.createCrucible, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has deleteCrucibleFromFoundry', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.deleteCrucibleFromFoundry, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has getCrucibleCount', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.getCrucibleCount, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has loadCrucibleFromCreateTxHash', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.loadCrucibleFromCreateTxHash, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has loadCrucibleFromAddress', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.loadCrucibleFromAddress, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has loadCrucibleFromIndex', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.loadCrucibleFromIndex, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has addCommitment', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.addCommitment, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has participantExists', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.participantExists, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});

test('has getCommitmentCount', async t => {
  const libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible.getCommitmentCount, 'function');
  } catch (err) {
    t.fail(err.message);
  }
});
