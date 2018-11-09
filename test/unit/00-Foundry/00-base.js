import test from 'ava';

const HDWalletProvider = require('truffle-hdwallet-provider');
const LibCrucible = require('../../../').default;

const MNEMONIC = process.env.MNEMONIC;
const FOUNDRY_PROXY = process.env.FOUNDRY_PROXY;

test.beforeEach(async t => {
  var providerUrl;

  if (process.env.CRUCIBLE_ENV === 'production') {
    providerUrl = 'https://mainnet.infura.io/';
  } else if (process.env.CRUCIBLE_ENV === 'staging') {
    providerUrl = 'https://rinkeby.infura.io/';
  } else if (process.env.CRUCIBLE_ENV === 'ropsten') {
    providerUrl = 'https://ropsten.infura.io/';
  } else if (process.env.CRUCIBLE_ENV === 'kovan') {
    providerUrl = 'https://kovan.infura.io/';
  } else {
    providerUrl = 'https://rinkeby.infura.io/';
  }

  const config = {
    foundryAddress: FOUNDRY_PROXY
  };

  var provider = new HDWalletProvider(MNEMONIC, providerUrl);
  t.context.libCrucible = new LibCrucible(provider, config);
});

test.afterEach(async t => {
  t.true(true);
});

test('new LibCrucibe is an object', async t => {
  var libCrucible = t.context.libCrucible;

  try {
    t.is(typeof libCrucible, 'object');
  } catch (err) {
    t.fail(err.message);
  }
});
