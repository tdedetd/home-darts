import { createAction, props } from '@ngrx/store';
import { GameInfoApi } from '@models/game-info-api.interface';
import { GameParamTypes } from '../../models/game-param-types.enum';

const source = '[Home darts]';

export const gameInfoLoadingStarted = createAction(
  `${source} Game Info Loading Started`,
  props<{ gameId: number }>()
);

export const getGameInfoLoadingSuccess = <GameParams extends object = Partial<Record<GameParamTypes, unknown>>>() =>
  createAction(
    `${source} Game Info Loading Success`,
    props<{ gameInfo: GameInfoApi<GameParams> }>()
  );

export const gameInfoLoadingSuccess = getGameInfoLoadingSuccess();

export const gameInfoLoadingError = createAction(`${source} Game Info Loading Error`);
