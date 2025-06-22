import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CreateZoneDto, UpdateZoneDto, Zone } from '@models';
import { SitesService } from 'app/services/sites.service';
import { ZonesService } from 'app/services/zones.service';
import { createZoneDtoFromForm } from 'app/utils/zone.dto-factories';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-zone-form',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, AsyncPipe],
  templateUrl: './zone-form.component.html',
  styleUrl: './zone-form.component.scss'
})
export class ZoneFormComponent {
  readonly dialogRef = inject(MatDialogRef<ZoneFormComponent>);
  readonly data = inject<Partial<Zone>>(MAT_DIALOG_DATA); // Should always at least have a site when creating
  private _fb = inject(FormBuilder);
  private _zoneService = inject(ZonesService);
  private _sitesService = inject(SitesService); // Assuming ZonesService has a method to get sites

  form = this._fb.group({
    id: [this.data?.id || null], // Assuming 'id' is optional and can be null for new zones
    name: [this.data?.name || '', Validators.required],
    siteId: [this.data?.site?.id || null, Validators.required],
  });

  isEditMode = !!this.data?.id;

  sites$ = this._sitesService.getAllSites();

  onConfirmClick(): void {
    this.submit();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }


  submit(): void {
    if (this.form.invalid) {
     console.log("FORM IS INVALID", this.form)
      return; // TODO: Show validation errors
    }

    let dto: CreateZoneDto;

    if (this.isEditMode) {
      dto = createZoneDtoFromForm(this.form);// TODO: Fix the type to UpdateZoneDto
      this._updateZone(dto);
    } else {
      dto = createZoneDtoFromForm(this.form);
      this._createZone(dto);
    }

  }
  private _createZone(dto: CreateZoneDto) {
    this._zoneService.createZone(dto).subscribe({
      next: (zone: Zone) => {
        console.log('Zone created:', zone);
        this.dialogRef.close(zone);
      },
      error: (err) => {
        console.error('Error creating zone:', err);
      }
    });
  }
  private _updateZone(dto: CreateZoneDto) {
    this._zoneService.updateZone(this.data!.id!, dto).subscribe({
      next: (zone: Zone) => {
        console.log('Zone updated:', zone);
        this.dialogRef.close(zone);
      },
      error: (err) => {
        console.error('Error updating zone:', err);
      }
    });
  }
}
