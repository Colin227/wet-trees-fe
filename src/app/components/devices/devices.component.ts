import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Device } from 'app/models/devices';
import { DeviceService } from 'app/services/device.service';
import { BehaviorSubject } from 'rxjs';
import { DeviceFormComponent } from '../device-form/device-form.component';
import { DeviceViewDialogComponent } from '../device-view-dialog/device-view-dialog.component';

@Component({
  selector: 'app-devices',
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent implements OnInit {
  private deviceService = inject(DeviceService);

  private _devices$ = new BehaviorSubject<Device[]>([]);

  readonly dialog = inject(MatDialog);

  devices$ = this._devices$.asObservable();

  dataSource = new MatTableDataSource<Partial<Device>>();
  @ViewChild(MatTable) table!: MatTable<Device>;

  displayedColumns: string[] = ['id', 'deviceId', 'zone', 'actions'];


  private _loadDevices() {
    this.deviceService.getAllDevices().subscribe({
      next: (devices: Device[]) => {
        console.log('Devices loaded:', devices);
        this._devices$.next(devices);
        this.dataSource.data = devices; // Update the data source for the table
        this.table.renderRows();
      },
      error: (err) => {
        console.error('Error loading devices:', err);
      }
    });
  }

  // Lifecycle hook to load waterings when the component is initialized   
  ngOnInit() {
    this._loadDevices();
  }

  createDevice() {
    console.log("TODO")
    const dialogRef = this.dialog.open(DeviceFormComponent, {
      data: {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadDevices();
      }
    })
  }

  editDevice(device: Device) {
    console.log("TODO: Edit device ", device);
    const dialogRef = this.dialog.open(DeviceFormComponent, {
      data: device
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._loadDevices();
      }
    })
  }

  deleteDevice(device: Device) {
    console.log("TODO: Delete device ", device);
  }

  viewDevice(device: Device) {
    console.log("TODO: View device")
    const dialogRef = this.dialog.open(DeviceViewDialogComponent, {
      data: device,
      width: '900px',
      height: '500px'
    })
  }
}
