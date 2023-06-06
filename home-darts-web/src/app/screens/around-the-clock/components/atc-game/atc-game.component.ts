import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getSectionsForAroundTheClock } from '../../utils/functions/get-sections-for-around-the-clock';
import { GameDirections } from '../../models/game-directions.enum';
import { AroundTheClockApiService } from '../../service/around-the-clock-api.service';
import { catchError } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { gameInfoLoadingStarted } from '../../../../store/actions/home-darts.actions';
import { atcResetGame } from '../../store/actions/around-the-clock.actions';
import { AroundTheClockState } from '../../models/around-the-clock-state.inteface';

@UntilDestroy()
@Component({
  selector: 'hd-atc-game',
  templateUrl: './atc-game.component.html',
  styleUrls: ['./atc-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtcGameComponent implements OnInit, OnDestroy {
  public get buttonDisabled(): boolean {
    return this.loading || this.isCompleted;
  };

  public get currentSection(): number | undefined {
    return this.getSection(this.hits);
  }

  public errorDebug = '';
  public loading = false;
  public throws = 0;
  public hits = 0;
  public gameId: number | null = null;
  public isCompleted = false;

  private sections = getSectionsForAroundTheClock(GameDirections.ForwardBackward, true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private atcApi: AroundTheClockApiService,
    private store: Store<{ aroundTheClock: AroundTheClockState }>,
  ) {}

  public ngOnInit(): void {
    this.gameId = Number(this.activatedRoute.snapshot.paramMap.get('gameId'));
    this.store.dispatch(gameInfoLoadingStarted({ gameId: this.gameId }));
  }

  public ngOnDestroy(): void {
    this.store.dispatch(atcResetGame());
  }

  public onCompleteBtnClick(): void {
    if (this.gameId === null) return;

    this.atcApi.complete(this.gameId)
      .pipe(
        catchError((err) => {
          this.loading = false;
          this.errorDebug = 'complete';
          this.cdr.detectChanges();
          return err;
        }),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.loading = false;
        this.isCompleted = true;
        this.cdr.detectChanges();
      });
  }

  public onHit(): void {
    this.throw(this.currentSection, true);
  }

  public onMiss(): void {
    this.throw(this.currentSection, false);
  }

  public getSection(index: number): number | undefined {
    return this.sections[index];
  }

  public onUndo(): void {
    if (this.gameId === null) return;

    this.loading = true;
    this.cdr.detectChanges();

    this.atcApi.undo(this.gameId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (deletedThrow) => {
          this.loading = false;

          if (deletedThrow) {
            this.throws--;
            if (deletedThrow.hit) this.hits--;
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.errorDebug = 'undo';
          this.cdr.detectChanges();
          return err;
        }
      });
  }

  private throw(nominal: number | undefined, hit: boolean): void {
    if (this.gameId === null || typeof nominal === 'undefined') return;

    this.loading = true;
    this.cdr.detectChanges();

    this.atcApi.throw(nominal, hit, this.gameId)
      .pipe(
        catchError((err) => {
          this.loading = false;
          this.errorDebug = `throw - hit ${hit}`;
          this.cdr.detectChanges();
          return err;
        }),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.loading = false;
        this.throws++;
        if (hit) this.hits++;
        this.cdr.detectChanges();
      });
  }
}
