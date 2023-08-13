import { PlayerApi } from '@models/player-api.interface';
import { ThrowsGrouped } from '@models/throws-grouped.interface';
import { GameInfoApi } from '@models/game-info-api.interface';
import { AroundTheClockParams } from '../../../models/around-the-clock-params.interface';
import { throwsPerTurn } from '@constants/throws-per-turn';
import { AroundTheClockInitError } from '../../../models/errors/around-the-clock-init-error';

interface PlayersTrows {
  playerId: PlayerApi['id'],
  throws: number;
}

export function getCurrentPlayerOnLoad(
  gameInfo: GameInfoApi<AroundTheClockParams>,
  throwsGrouped: ThrowsGrouped[]
): PlayerApi['id'] | null {
  const players = gameInfo.players;

  const playersThrows: PlayersTrows[] = players.map(({ id }) => ({
    playerId: id,
    throws: throwsGrouped.find((playerThrows) => playerThrows.playerId === id)?.throws ?? 0
  }));

  const uniqueSortedThrows = Array.from(new Set(playersThrows.map(({ throws }) => throws))).sort((a, b) => b - a);
  validateThrowsCount(uniqueSortedThrows, gameInfo.id);

  return uniqueSortedThrows.length === 1
    ? playersThrows[0].playerId
    : getPlayerIdFromUniqueValues(playersThrows, uniqueSortedThrows);
}

function getPlayerIdFromUniqueValues(playersThrows: PlayersTrows[], uniqueSortedThrows: number[]): PlayerApi['id'] {
  const index = uniqueSortedThrows[0] % throwsPerTurn === 0 ? 1 : 0;
  const player = playersThrows.find(({ throws }) => throws === uniqueSortedThrows[index]);
  if (!player) throw new AroundTheClockInitError('Error while detecting current playerId');
  return playersThrows[playersThrows.indexOf(player)].playerId;
}

function validateThrowsCount(uniqueSortedThrows: number[], gameId: number): void {
  const len = uniqueSortedThrows.length;
  const valid = len >= 1 && len <= 3 &&
    uniqueSortedThrows[0] - uniqueSortedThrows[len - 1] <= throwsPerTurn;

  if (!valid) throw new AroundTheClockInitError(`Incorrect number of throws. Game with id ${gameId} is broken`);
}