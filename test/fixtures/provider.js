"use strict";

const HDWalletProvider = require('truffle-hdwallet-provider');

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
  providerUrl = 'http://localhost:8545/';
}

var privateKeys = [
  '859678781994101043ece30f4f1315a919dffee9b5e70f0ac6b8ab3e3fe05fe6',
  '5dcc0555c4e981122cfc6c34b7275604feeaeeca52ac782f36619a99573bf2a0',
  '2e04b35cec26e658516ddb012d3171ee92ca339646fe824648d5582b13b5a829',
  '34fda23aa544c03a50846e625dbda3fcfe5c6081d35a226f66c33c4e24cd345a',
  'c3185aba90f5df13a1268eb85f65a723f9126d0d65013717357c2fd71fc25c40',
];

var provider = new HDWalletProvider(
  privateKeys, providerUrl, 0, privateKeys.length
);

module.exports = provider;
