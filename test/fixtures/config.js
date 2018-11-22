"use strict";

const FOUNDRY_PROXY = '0xb8d17ac1eeeaa6efbc1c0229f9e6d23655136fd1';

let proxyAddr = FOUNDRY_PROXY;

if (process.env.CRUCIBLE_ENV !== 'development' && process.env.FOUNDRY_PROXY) {
  proxyAddr = process.env.FOUNDRY_PROXY;
}

const config = {
  foundryAddress: proxyAddr
};

module.exports = config;
