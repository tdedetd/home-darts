import { GameInfoApi } from '@models/game-info-api.interface';
import { AroundTheClockParams } from './around-the-clock-params.interface';
import { AroundTheClockParticipant } from './around-the-clock-participant.interface';
import { GameLoadingStatuses } from '@models/game-loading-statuses.enum';
import { PlayerApi } from '../../../models/player-api.interface';

export interface AroundTheClockState {
  currentPlayerId: number | null;
  gameInfo: GameInfoApi<AroundTheClockParams> | null;
  loadingStatus: GameLoadingStatuses,
  participants: Record<PlayerApi['id'], AroundTheClockParticipant>;
  sections: number[];
}
