import { createSelector } from '@ngrx/store';
import { AroundTheClockState } from '../../models/around-the-clock-state.inteface';

const selectAroundTheClockState = (state: { aroundTheClock: AroundTheClockState }) => state.aroundTheClock;

export const selectAtcGameInfo = createSelector(
  selectAroundTheClockState,
  (aroundTheClock: AroundTheClockState) => aroundTheClock.gameInfo
);
