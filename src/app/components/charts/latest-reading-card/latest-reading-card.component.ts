import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LatestReading } from '@models';

@Component({
  selector: 'app-latest-reading-card',
  imports: [MatCardModule, MatIconModule, DatePipe],
  templateUrl: './latest-reading-card.component.html',
  styleUrl: './latest-reading-card.component.scss'
})
export class LatestReadingCardComponent {
  @Input() latest: LatestReading | null = null;
}
