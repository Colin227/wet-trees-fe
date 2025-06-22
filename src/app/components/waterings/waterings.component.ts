import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { WateringEvent } from '@models';
import { WateringsService } from 'app/services/waterings.service';
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { WateringFormComponent } from '../watering-form/watering-form.component';

@Component({
  selector: 'app-waterings',
  imports: [AsyncPipe, JsonPipe, MatButtonModule, MatIconModule, MatTableModule, DatePipe],
  templateUrl: './waterings.component.html',
  styleUrl: './waterings.component.scss'
})
export class WateringsComponent implements OnInit {
  private wateringService = inject(WateringsService);

  private _waterings$ = new BehaviorSubject<WateringEvent[]>([]);
  
  readonly dialog = inject(MatDialog);

  waterings$ = this._waterings$.asObservable();

  dataSource = new MatTableDataSource<Partial<WateringEvent>>();
  @ViewChild(MatTable) table!: MatTable<WateringEvent>;

    displayedColumns: string[] = ['id', 'wateredAt', 'notes', 'recordedBy', 'zone', 'actions'];

  private _loadWaterings() {
    this.wateringService.getAllWaterings().subscribe({
      next: (waterings: WateringEvent[]) => {
        console.log('Waterings loaded:', waterings);
        this._waterings$.next(waterings);
        this.dataSource.data = waterings; // Update the data source for the table
        this.table.renderRows(); 
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

  createWatering() {
    const dialogRef = this.dialog.open(WateringFormComponent, {
      data: {}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New watering created:', result);
        this._loadWaterings(); // Reload waterings after creation
      }
    });
  
  }

  editWatering(watering: WateringEvent) {
    const dialogRef = this.dialog.open(WateringFormComponent, {
      data: watering
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Watering updated:', result);
        this._loadWaterings(); // Reload waterings after update
      } else {
        console.log('Watering update cancelled');
      }
    });
  }

  deleteWatering(watering: WateringEvent) {
    console.log('Delete watering button clicked for:', watering);
    // Logic to delete the watering event
    // This would typically involve calling a service method to delete the watering and updating the UI accordingly
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Watering',
        message: `Are you sure you want to delete the watering with ID ${watering.id}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Watering deleted:', watering);
        this.wateringService.deleteWatering(watering.id).subscribe({
          next: () => {
            console.log('Tree deleted successfully'); // TODO: Show success message
            this._loadWaterings(); // Reload trees after deletion
          },
          error: (err) => {
            console.error('Error deleting tree:', err); // TODO: Show error message
          }
        });
      }
    });
  }

}
