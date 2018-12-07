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

test('creates a new crucible', async t => {
  var libCrucible = t.context.libCrucible;
  var cu = t.context.cu;
  var address = t.context.address;

  cu.txOpts.nonce = await libCrucible.web3.eth.getTransactionCount(
    address.oracle
  );

  try {
    var txHash = await libCrucible.createCrucible(
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
    t.falsy(libCrucible.crucible, 'crucible not loaded yet');
    await libCrucible.loadCrucibleFromCreateTxHash(txHash);
    t.truthy(libCrucible.crucible, 'crucible loaded successfully');
    var commitments = await libCrucible.getCommitmentCount();
    t.is(commitments, '0', 'there are no commitments yet');
  } catch (err) {
    t.fail(err.message);
  }
});
