import { GameParamDatatype } from '../types/game-param-datatype.enum.js';
import { GameParamValue } from '../types/game-param-value.type.js';

export const gameParamCastValueStrategy: Record<GameParamDatatype, (value: string) => GameParamValue> = {
  [GameParamDatatype.Boolean]: (value: string) => value === 'true',
  [GameParamDatatype.Number]: (value: string) => Number(value),
  [GameParamDatatype.String]: (value: string) => value,
};
