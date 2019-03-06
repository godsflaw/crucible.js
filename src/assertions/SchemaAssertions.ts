'use strict';

import { schemaAssertionsError } from '../errors';
import { schemas, Schema, SchemaValidator } from '../schemas';

/*
 * A bunch of this has been borrowed from the awesome setprotocol.js's repo
 */
export class SchemaAssertions {
  private validator: SchemaValidator;

  constructor() {
    this.validator = new SchemaValidator();
  }

  public isValidAddress(variableName: string, value: any) {
    this.assertConformsToSchema(variableName, value, schemas.addressSchema);
  }

  public isValidBytes32(variableName: string, value: any) {
    this.assertConformsToSchema(variableName, value, schemas.bytes32Schema);
  }

  public isValidBytes(variableName: string, value: any) {
    this.assertConformsToSchema(variableName, value, schemas.bytesSchema);
  }

  public isValidNumber(variableName: string, value: any) {
    this.assertConformsToSchema(variableName, value, schemas.numberSchema);
  }

  public isValidWholeNumber(variableName: string, value: any) {
    this.assertConformsToSchema(variableName, value, schemas.wholeNumberSchema);
  }

  private assertConformsToSchema(variableName: string, value: any, schema: Schema): void {
    const validationResult = this.validator.validate(value, schema);
    const hasValidationErrors = validationResult.errors.length > 0;

    if (hasValidationErrors) {
      throw new Error(
        schemaAssertionsError.DOES_NOT_CONFORM_TO_SCHEMA(
          variableName,
          schema.id,
          value,
          validationResult,
        ),
      );
    }
  }
}
