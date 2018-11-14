'use strict';

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const foundryJSON = require('../../crucible/build/contracts/Foundry.json');

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

let web3 = new Web3(new HDWalletProvider(MNEMONIC, providerUrl));

let foundry = new web3.eth.Contract(
  foundryJSON.abi,
  FOUNDRY_PROXY,
  {
    gasLimit: web3.utils.toWei('10', 'gwei')
  }
);

async function getCount() {
  return await foundry.methods.getCount().call();
}

(async() => {
  try {
    console.log(await getCount());
  } catch (err) {
    console.log(err);
  }

  process.exit();
})();
