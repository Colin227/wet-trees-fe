import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { WateringEvent } from '@models';
import { WateringsService } from 'app/services/waterings.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-waterings',
  imports: [AsyncPipe, JsonPipe, MatButtonModule, MatIconModule, MatTableModule, DatePipe],
  templateUrl: './waterings.component.html',
  styleUrl: './waterings.component.scss'
})
export class WateringsComponent implements OnInit{
private wateringService = inject(WateringsService);

  private _waterings$ = new BehaviorSubject<WateringEvent[]>([]);

  waterings$ = this._waterings$.asObservable();

  dataSource = new MatTableDataSource<Partial<WateringEvent>>();

  private _loadWaterings() {
    this.wateringService.getAllWaterings().subscribe({
      next: (waterings: WateringEvent[]) => {
        console.log('Waterings loaded:', waterings);
        this._waterings$.next(waterings);
      },
      error: (err) => {
        console.error('Error loading waterings:', err);
      }
    });
  }
  
  // Lifecycle hook to load waterings when the component is initialized   
  ngOnInit() {
    this._loadWaterings();
  }
}
