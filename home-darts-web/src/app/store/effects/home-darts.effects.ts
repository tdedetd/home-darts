import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { gameInfoLoadingError, gameInfoLoadingStarted, gameInfoLoadingSuccess } from '../actions/home-darts.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { GameApiService } from '../../services/game-api.service';

@Injectable()
export class HomeDartsEffects {
  public loadGameInfo$ = createEffect(() => this.actions$.pipe(
    ofType(gameInfoLoadingStarted),
    switchMap(({ gameId }) => this.gameApi.getGameInfo(gameId)),
    map(gameInfo => gameInfoLoadingSuccess({ gameInfo })),
    catchError(() => of(gameInfoLoadingError())))
  );

  constructor(private actions$: Actions, private gameApi: GameApiService) { }
}
