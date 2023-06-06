import { createAction } from '@ngrx/store';

const source = '[Around The Clock]';

export const atcResetGame = createAction(`${source} Reset Game`);
