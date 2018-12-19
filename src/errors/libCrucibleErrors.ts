'use strict';

// TODO(godsflaw): add i18n support
export const libCrucibleErrors = {
  CRUCIBLE_UNDEFINED: () => 'crucible is udefined, please call ' +
    'loadCrucibleFromCreateTxHash() or loadCrucibleFromAddress() first',
  TX_VALUE_UNDEFINED: () => 'txOpts.value must be defined',
};
