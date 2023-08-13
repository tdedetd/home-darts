import { createSelector } from '@ngrx/store';
import { selectCurrentPlayerId } from './current-player-id.selector';
import { PlayerApi } from '../../../../models/player-api.interface';
import { selectParticipants } from './participants.selector';
import { AtcParticipant } from '../../models/atc-participant.interface';

export const selectIsCurrentPlayerCompleted = createSelector(
  selectCurrentPlayerId,
  selectParticipants,
  (id: PlayerApi['id'] | null, participants: Partial<Record<number, AtcParticipant>>) =>
    id !== null && Boolean(participants[id]?.isCompleted)
);
