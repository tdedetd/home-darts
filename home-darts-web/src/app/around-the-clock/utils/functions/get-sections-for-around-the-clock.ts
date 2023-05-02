import { GameDirections } from 'src/app/around-the-clock/models/game-directions.enum';
import { bullSection } from '../../../utils/constants/bull-section';
import { commonSections } from 'src/app/utils/constants/common-sections';

const sectionsWithoutBullStrategy: Record<GameDirections, number[]> = {
  [GameDirections.Backward]: [...commonSections].reverse(),
  [GameDirections.Forward]: [...commonSections],
  [GameDirections.ForwardBackward]: [...commonSections, ...[...commonSections].reverse().slice(1)],
};

const sectionsWithBullStrategy: Record<GameDirections, number[]> = {
  [GameDirections.Backward]: [bullSection, ...[...commonSections].reverse()],
  [GameDirections.Forward]: [...commonSections, bullSection],
  [GameDirections.ForwardBackward]: [...commonSections, bullSection, ...[...commonSections].reverse()],
};

export const getSectionsForAroundTheClock = (direction: GameDirections, includeBull: boolean): number[] => {
  return includeBull ? sectionsWithBullStrategy[direction] : sectionsWithoutBullStrategy[direction];
};
