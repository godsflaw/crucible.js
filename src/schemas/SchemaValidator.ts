'use strict';

import * as _ from 'lodash';
import { Schema, Validator, ValidatorResult } from 'jsonschema';

import { schemas } from './schemas';
import { bigNumberFormat, wholeBigNumberFormat } from './customFormats';

/**
 * Borrowed, with slight modification, from the wonderful dharma codebase and 0x.js project codebase:
 * https://github.com/0xProject/0x.js/tree/development/packages/json-schemas
 */
export class SchemaValidator {
  private _validator: Validator;

  constructor() {
    this._validator = new Validator();

    this.addCustomValidators();

    for (const schema of _.values(schemas)) {
      this._validator.addSchema(schema, schema.id);
    }
  }

  public addSchema(schema: Schema) {
    this._validator.addSchema(schema, schema.id);
  }

  public validate(instance: any, schema: Schema): ValidatorResult {
    return this._validator.validate(instance, schema);
  }

  public isValid(instance: any, schema: Schema): boolean {
    const isValid = this.validate(instance, schema).errors.length === 0;
    return isValid;
  }

  public addCustomValidators() {
    this._validator.customFormats.BigNumber = bigNumberFormat;
    this._validator.customFormats.wholeBigNumber = wholeBigNumberFormat;
  }
}
