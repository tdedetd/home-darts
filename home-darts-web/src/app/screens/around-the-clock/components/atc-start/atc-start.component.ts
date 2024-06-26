import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AroundTheClockApiService } from '../../service/around-the-clock-api.service';
import { GameDirections } from '../../models/game-directions.enum';
import { SectionTypes } from '@models/enums/section-types.enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { gameDirectionItems } from '../../utils/constants/game-direction-items';
import { sectionTypesItems } from '@constants/section-type-items';
import { PlayerApiService } from '../../../../services/player-api.service';
import { Observable, tap } from 'rxjs';
import { PlayerApi } from '@models/player-api.interface';
import { arrayMinLengthValidator } from '@functions/array-min-length.validator';
import { Store } from '@ngrx/store';
import { hideGlobalProgressBar, showGlobalProgressBar } from '../../../../store/actions/global-progress-bar.actions';
import { DefaultPlayerService } from '../../../../services/default-player.service';

@UntilDestroy()
@Component({
  selector: 'hd-atc-start',
  templateUrl: './atc-start.component.html',
  styleUrls: ['./atc-start.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtcStartComponent {
  public readonly gameDirectionItems = gameDirectionItems;
  public readonly sectionTypes = sectionTypesItems;
  public readonly players$: Observable<PlayerApi[]> = this.playerApi.getPlayers().pipe(
    tap(players => this.setDefaultPlayer(players))
  );

  public form = this.fb.group({
    players: this.fb.nonNullable.control<PlayerApi['id'][]>([], arrayMinLengthValidator(1)),
    direction: this.fb.nonNullable.control<GameDirections>(GameDirections.ForwardBackward),
    fastGame: this.fb.nonNullable.control<boolean>(false),
    hitDetection: this.fb.nonNullable.control<SectionTypes>(SectionTypes.Any),
    includeBull: this.fb.nonNullable.control<boolean>(true),
  });
  public loading = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private atcApi: AroundTheClockApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private playerApi: PlayerApiService,
    private store: Store,
    private defaultPlayer: DefaultPlayerService,
  ) { }

  public submit(): void {
    if (!this.form.valid) {
      return;
    }

    this.store.dispatch(showGlobalProgressBar());
    this.loading = true;
    this.cdr.detectChanges();

    this.atcApi.start(this.form.getRawValue())
      .pipe(untilDestroyed(this))
      .subscribe({
        next: ({ gameId }) => {
          this.store.dispatch(hideGlobalProgressBar());
          this.router.navigate([`./${gameId}`], { relativeTo: this.activatedRoute });
          this.defaultPlayer.save(this.form.controls.players.getRawValue()[0]);
        },
        error: (err) => {
          this.store.dispatch(hideGlobalProgressBar());
          this.loading = false;
          this.cdr.detectChanges();
          return err;
        },
      });
  }

  private setDefaultPlayer(players: PlayerApi[]): void {
    const playerId = this.defaultPlayer.load();
    const player = players.find(({ id }) => id === playerId);
    if (playerId !== null && player) {
      this.form.controls.players.setValue([playerId]);
    }
  }
}
