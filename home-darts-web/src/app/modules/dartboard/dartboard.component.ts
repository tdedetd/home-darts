import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { SectionTypes } from '@models/enums/section-types.enum';
import { DartboardRenderer } from './classes/dartboard-renderer.class';
import { DartboardSector } from '@models/types/dartboard-sector.type';
import { DartboardStyles } from '@models/enums/dartboard-styles.enum';
import { dartboardStyleMapper } from './constants/dartboard-style-mapper';

@Component({
  selector: 'hd-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DartboardComponent implements OnChanges, AfterViewInit {
  @ViewChild('dartboard') public dartboard!: ElementRef<HTMLCanvasElement>;

  @Input() public sector: DartboardSector = 0;
  @Input() public sectorType: SectionTypes = SectionTypes.Any;
  @Input() public style: DartboardStyles = DartboardStyles.Material;

  private dartboardRenderer?: DartboardRenderer;
  private renderQuality = 2;

  public ngOnChanges(changes: SimpleChanges): void {
    const sectorChange = changes['sector'];
    const sectorTypeChange = changes['sectorType'];
    if (sectorChange && sectorChange.currentValue !== sectorChange.previousValue ||
      sectorTypeChange && sectorTypeChange.currentValue !== sectorTypeChange.previousValue) {

      this.dartboardRenderer?.focusSector(this.sector, this.sectorType);
    }
  }

  public ngAfterViewInit(): void {
    const el = this.dartboard.nativeElement;
    const context = el.getContext('2d');
    if (context) {
      el.width = el.clientWidth;
      el.height = el.clientWidth;
      this.dartboardRenderer = new DartboardRenderer(context, 0, 0, dartboardStyleMapper[this.style]);
      this.dartboardRenderer.focusSector(this.sector, this.sectorType);
      this.updateCanvasResolution = this.updateCanvasResolution.bind(this);
      new ResizeObserver(this.updateCanvasResolution).observe(el);
    }
  }

  private updateCanvasResolution(): void {
    if (!this.dartboardRenderer) {
      return;
    }

    this.dartboard.nativeElement.width = this.dartboard.nativeElement.clientWidth * this.renderQuality;
    this.dartboard.nativeElement.height = this.dartboard.nativeElement.clientWidth * this.renderQuality;
    const { width, height } = this.dartboard.nativeElement;
    this.dartboardRenderer.updateRenderResolution(width, height);
    this.dartboardRenderer.render();
  }
}
