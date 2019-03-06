'use strict';

import Web3 from 'web3';

import { FoundryAssertions } from './FoundryAssertions';
import { CrucibleAssertions } from './CrucibleAssertions';
import { SchemaAssertions } from './SchemaAssertions';

export class Assertions {
  public foundry: FoundryAssertions;
  public crucible: CrucibleAssertions;
  public schema: SchemaAssertions;

  public constructor(web3: Web3) {
    this.foundry = new FoundryAssertions(web3);
    this.crucible = new CrucibleAssertions(web3);
    this.schema = new SchemaAssertions();
  }
}

