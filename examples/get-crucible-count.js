'use strict';

const HDWalletProvider = require('truffle-hdwallet-provider');
const LibCrucible = require('../').default;

const MNEMONIC = process.env.MNEMONIC;
const FOUNDRY_PROXY = process.env.FOUNDRY_PROXY;

if (!MNEMONIC || !FOUNDRY_PROXY) {
  console.error('Please set a mnemonic, network, and contract address.');
  return;
}

let providerUrl;

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
let provider = new HDWalletProvider(MNEMONIC, providerUrl);
let libCrucible = new LibCrucible(provider, config);

async function getCrucibleCount() {
  return await libCrucible.getCrucibleCount();
}

(async() => {
  try {
    console.log(await getCrucibleCount());
  } catch (err) {
    console.log(err);
  }

  process.exit();
})();
