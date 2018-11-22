"use strict";

function Address(options) {
  if (false === (this instanceof Address)) {
   return new Address(options);
  }

  options = options || {};

  this.empty = '0x0000000000000000000000000000000000000000';

  this.one = '0x5dee77e75a0f9e5272a02d67ce0bf9f3608355fe';
  this.two = '0xa33da2e00bf12026a0aa1bdc6670d8667a95a8be';
  this.three = '0xc22be120845b6565fbb3768c7df74bb47bda88bc';
  this.four = '0x5f63dd526d53edf386ce0f05d1749c1cee2e307a';
  this.five = '0x3d677e3280eed79076af4574364e4ec6ec20f87e';

  this.staging = '0x7af77b0d604D13a41e6d0f2175D8a61d5f1115C9';
  this.production = '0xB8bBf36ba36fc78F3F137C514Af33709fFFBa604';

  this.owner = this.one;
  this.oracle = this.two;
  this.user1 = this.three;
  this.user2 = this.four;
  this.user3 = this.five;

  if (process.env.CRUCIBLE_ENV === 'production') {
    this.oracle = this.production;
  } else if (process.env.CRUCIBLE_ENV === 'staging') {
    this.oracle = this.staging;
  } else if (process.env.CRUCIBLE_ENV === 'ropsten') {
    this.oracle = this.staging;
  } else if (process.env.CRUCIBLE_ENV === 'kovan') {
    this.oracle = this.staging;
  }
}

module.exports = Address;
