import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateWateringDto, Site, WateringEvent, Zone } from '@models';
import { AuthService } from 'app/services/auth.service';
import { SitesService } from 'app/services/sites.service';
import { WateringsService } from 'app/services/waterings.service';
import { ZonesService } from 'app/services/zones.service';
import { createWateringDtoFromForm } from 'app/utils/watering.dto-factories';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-watering-form',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, AsyncPipe, MatDatepickerModule, MatInputModule],
  templateUrl: './watering-form.component.html',
  styleUrl: './watering-form.component.scss'
})
export class WateringFormComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<WateringFormComponent>);
  readonly data = inject<Partial<WateringEvent>>(MAT_DIALOG_DATA);
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);

  private _wateringService = inject(WateringsService);
  private _sitesService = inject(SitesService);

  sites$!: Observable<Site[]>;

  form = this._fb.group({
    id: [this.data?.id || null],
    wateredAt: [this.data?.wateredAt || new Date(), Validators.required],
    notes: [this.data?.notes || '', Validators.maxLength(500)],
    recordedBy: [this.data?.recordedBy || '', Validators.required],
    zoneId: [this.data?.zone?.id || null, Validators.required],
  });
  isEditMode = !!this.data?.id;

  ngOnInit(): void {
    this.sites$ = this._sitesService.getAllSites();
  }
  
  onConfirmClick(): void {
    this.submit();
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }
  
  submit(): void {
    if (this.form.invalid) {
      console.log("FORM IS INVALID", this.form);
      return; // TODO: Show validation errors
    }

    let dto: CreateWateringDto;
    
    if (this.isEditMode) {
      dto = createWateringDtoFromForm(this.form); // TODO: Fix the type to UpdateWateringDto
      this._updateWatering(dto);
    } else {
      dto = createWateringDtoFromForm(this.form);
      this._createWatering(dto);
    }
  }

  private _createWatering(dto: CreateWateringDto): void {
    this._wateringService.createWatering(dto).subscribe({
      next: (watering) => {
        console.log('Watering created:', watering);
        this.dialogRef.close(watering);
      },
      error: (err) => {
        console.error('Error creating watering:', err);
      }
    });
  }
  
  private _updateWatering(dto: CreateWateringDto): void {
    this._wateringService.updateWatering(this.data!.id!, dto).subscribe({
      next: (watering) => {
        console.log('Watering updated:', watering);
        this.dialogRef.close(watering);
      },
      error: (err) => {
        console.error('Error updating watering:', err);
      }
    });
  }

}
