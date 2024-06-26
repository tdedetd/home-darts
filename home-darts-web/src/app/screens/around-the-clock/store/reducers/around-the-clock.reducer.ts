import { createReducer, on } from '@ngrx/store';
import { AroundTheClockState } from '../../models/around-the-clock-state.interface';
import { gameInfoLoadingError } from '../../../../store/actions/game-info.actions';
import {
  atcCompleteSuccess,
  atcGameInitialized,
  atcResetGame,
  atcTrowStart,
  atcTrowSuccess,
  atcUndoSuccess
} from '../actions/around-the-clock.actions';
import { getSectionsForAroundTheClock } from '../../utils/functions/get-sections-for-around-the-clock';
import { GameLoadingStatuses } from '@models/enums/game-loading-statuses.enum';
import { getNextPlayerId } from './utils/get-next-player-id';
import { getCurrentPlayerOnInit } from './utils/get-current-player-on-init';
import { checkTurnOver } from './utils/check-turn-over';
import { isNotEmpty } from '@functions/type-guards/is-not-empty';
import { AtcParticipants } from '../../models/atc-participants.type';
import { isPerfectTurn } from './utils/is-perfect-turn';
import { HttpStatusCode } from '@angular/common/http';
import { getSortedLastThrows } from './utils/get-sorted-last-throws';
import { getInitialParticipants } from './utils/get-initial-participants';
import { getParticipantAfterThrow } from './utils/get-participant-after-throw';
import { getAffectedParticipantsAfterUndo } from './utils/get-affected-participants-after-undo';

const initialState: AroundTheClockState = {
  initStatus: GameLoadingStatuses.Pending,
  currentPlayerId: null,
  gameInfo: null,
  loading: true,
  sections: [],
  participants: {},
  turnOverOnLastThrow: false,
};

export const aroundTheClockReducer = createReducer<AroundTheClockState>(
  initialState,
  on(atcGameInitialized, (state, { gameInfo, throwsGrouped, lastThrowsByPlayers }): AroundTheClockState => {
    const sections = getSectionsForAroundTheClock(gameInfo.params.direction, gameInfo.params.includeBull);
    const currentPlayerId = getCurrentPlayerOnInit(
      gameInfo.players,
      throwsGrouped,
      sections,
      getSortedLastThrows(lastThrowsByPlayers)
    );
    const participants = getInitialParticipants(
      gameInfo.players,
      throwsGrouped,
      sections,
      currentPlayerId,
      lastThrowsByPlayers
    );

    return {
      ...state,
      initStatus: GameLoadingStatuses.Initiated,
      currentPlayerId,
      gameInfo,
      loading: false,
      sections,
      participants,
    };
  }),
  on(gameInfoLoadingError, (_, { err }): AroundTheClockState => ({
    ...initialState,
    initStatus: err.status === HttpStatusCode.NotFound
      ? GameLoadingStatuses.NoSuchGame
      : GameLoadingStatuses.UnexpectedError,
  })),
  on(atcResetGame, (): AroundTheClockState => initialState),
  on(atcTrowStart, (state): AroundTheClockState => ({ ...state, loading: true })),
  on(atcTrowSuccess, (state, { hit }): AroundTheClockState => {
    if (state.currentPlayerId === null) {
      return state;
    }

    const isTurnOver = checkTurnOver(state);
    const participantAfterThrow = getParticipantAfterThrow(
      state.sections, hit, state.participants[state.currentPlayerId]
    );

    const newCurrentPlayerId =
      isTurnOver && !isPerfectTurn(participantAfterThrow.turnHits) || participantAfterThrow.isCompleted
      ? getNextPlayerId(state) : state.currentPlayerId;

    const newParticipantTurnHits: AtcParticipants | object = (
      isTurnOver && isNotEmpty(newCurrentPlayerId) && state.participants[newCurrentPlayerId] ? {
        [newCurrentPlayerId]: {
          ...state.participants[newCurrentPlayerId],
          ...(state.currentPlayerId === newCurrentPlayerId ? participantAfterThrow : {}),
          turnHits: [],
        }
      } : {}
    );

    return {
      ...state,
      currentPlayerId: newCurrentPlayerId,
      loading: false,
      participants: {
        ...state.participants,
        [state.currentPlayerId]: participantAfterThrow,
        ...newParticipantTurnHits
      },
      turnOverOnLastThrow: isTurnOver || participantAfterThrow.isCompleted,
    };
  }),
  on(atcUndoSuccess, (state, { canceledThrow, lastThrows }): AroundTheClockState => {
    if (!canceledThrow || !state.currentPlayerId) {
      return state;
    }

    const { newCurrentPlayerId, newParticipants } = getAffectedParticipantsAfterUndo(
      state,
      lastThrows,
      canceledThrow
    );

    return {
      ...state,
      currentPlayerId: newCurrentPlayerId,
      loading: false,
      participants: {
        ...state.participants,
        ...newParticipants,
      }
    };
  }),
  on(atcCompleteSuccess, (state): AroundTheClockState => ({
    ...state,
    gameInfo: state.gameInfo ? {
      ...state.gameInfo,
      isCompleted: true,
    } : state.gameInfo
  }))
);
