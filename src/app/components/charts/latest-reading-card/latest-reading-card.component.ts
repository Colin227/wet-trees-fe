import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LatestReading } from '@models';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-latest-reading-card',
  imports: [MatCardModule, MatIconModule, DatePipe, MatTooltipModule],
  templateUrl: './latest-reading-card.component.html',
  styleUrl: './latest-reading-card.component.scss'
})
export class LatestReadingCardComponent {
  @Input() latest: LatestReading | null = null;

  isOnline = (lastSeen?: string) => {
    if (!lastSeen) return false;

    const now = new Date();
    const threshold = 10 * 60 * 1000; // 10min in ms
    const lastSeenDate = new Date(lastSeen);
    return lastSeenDate && (now.getTime() - lastSeenDate.getTime()) < threshold;
  }
}
