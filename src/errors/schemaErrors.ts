'use strict';

import { ValidatorResult } from '../schemas';

export const schemaAssertionsError = {
  DOES_NOT_CONFORM_TO_SCHEMA: (
    variableName: string,
    schemaId: string | undefined,
    value: any,
    validationResult: ValidatorResult,
  ) => `
        Expected ${variableName} to conform to schema ${schemaId}.

        Encountered: ${JSON.stringify(value, undefined, '\t')}

        Validation errors: ${validationResult.errors.join(', ')}
      `,
};
