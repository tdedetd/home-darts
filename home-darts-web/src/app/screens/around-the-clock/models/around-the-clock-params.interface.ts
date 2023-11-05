import { GameParamTypes } from '@models/enums/game-param-types.enum';
import { SectionTypes } from '@models/enums/section-types.enum';
import { GameDirections } from './game-directions.enum';

export interface AroundTheClockParams {
  [GameParamTypes.Direction]: GameDirections;
  [GameParamTypes.FastGame]: boolean;
  [GameParamTypes.HitDetection]: SectionTypes;
  [GameParamTypes.IncludeBull]: boolean;
}
