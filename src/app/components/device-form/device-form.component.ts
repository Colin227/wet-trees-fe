import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Site } from '@models';
import { CreateDeviceDto, Device, UpdateDeviceDto } from 'app/models/devices';
import { DeviceService } from 'app/services/device.service';
import { SitesService } from 'app/services/sites.service';
import { createDeviceDtoFromForm, updateDeviceDtoFromForm } from 'app/utils/device.dto-factories';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-device-form',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, AsyncPipe],
  templateUrl: './device-form.component.html',
  styleUrl: './device-form.component.scss'
})
export class DeviceFormComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<DeviceFormComponent>);
  readonly data = inject<Device | undefined>(MAT_DIALOG_DATA);
  private _fb = inject(FormBuilder);
  private _sitesService = inject(SitesService);
  private _deviceService = inject(DeviceService);

  sites$!: Observable<Site[]>;

  form = this._fb.group({
    id: [this.data?.id || null],
    deviceId: [this.data?.deviceId || '', Validators.required],
    zone: [this.data?.zone?.id || '', Validators.required],
  });

  isEditMode = !!this.data?.id;

  ngOnInit(): void {
    this.sites$ = this._sitesService.getAllSites();
    if (this.isEditMode) {
      this.form.controls.deviceId.disable();
    }
  }

  onConfirmClick(): void {
    this.submit();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) return;

    let dto;


    if (this.isEditMode) {
      dto = updateDeviceDtoFromForm(this.form);
      this._updateDevice(dto);
    } else {
      dto = createDeviceDtoFromForm(this.form);
      this._createDevice(dto);
    }

  }

  private _updateDevice(dto: UpdateDeviceDto) {
    this._deviceService.updateDevice(dto).subscribe({
      next: (device: Device) => {
        console.log("Updated device successfully: ", device);
        this.dialogRef.close(device);
      },
      error: (err: any) => {
        console.error("Error updating device: ", err);
      }
    })
    
  }

  private _createDevice(dto: CreateDeviceDto) {
    this._deviceService.createDevice(dto).subscribe({
      next: (device: Device) => {
        console.log("Created device successfully: ", device);
        this.dialogRef.close(device);
      },
      error: (err: any) => {
        console.error("Error creating device: ", err);
      }
    })
  }
}
