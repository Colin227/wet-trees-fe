import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-latest-reading-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './latest-reading-card.component.html',
  styleUrl: './latest-reading-card.component.scss'
})
export class LatestReadingCardComponent {
  @Input() latest: { temperature: number; humidity: number; moisture: number } | null = null;
}
