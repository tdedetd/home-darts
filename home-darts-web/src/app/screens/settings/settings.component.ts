import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { selectSettings } from '../../store/selectors/settings.selector';
import { take } from 'rxjs';
import { updateSettings } from '../../store/actions/settings.actions';
import { isSettings } from '@functions/type-guards/is-settings';

@UntilDestroy()
@Component({
  selector: 'hd-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SettingsComponent implements OnInit {
  public form = this.fb.group({
    sounds: this.fb.nonNullable.control<boolean>(false, Validators.required),
    vibration: this.fb.nonNullable.control<boolean>(false, Validators.required),
  });

  constructor(
    private store: Store,
    private fb: FormBuilder,
  ) {}

  public ngOnInit(): void {
    this.initFormValueChanges();
    this.store.select(selectSettings).pipe(
      take(1),
      untilDestroyed(this)
    ).subscribe(settings => {
      this.form.setValue(settings);
    });
  }

  private initFormValueChanges(): void {
    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(settings => {
      if (isSettings(settings)) {
        this.store.dispatch(updateSettings({ settings }));
      }
    });
  }
}