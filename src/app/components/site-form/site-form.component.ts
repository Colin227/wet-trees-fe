import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CreateSiteDto, Site, UpdateSiteDto } from '@models';
import { SitesService } from 'app/services/sites.service';
import { createSiteDtoFromForm } from 'app/utils/site.dto-factories';


@Component({
  selector: 'app-site-form',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatOptionModule, MatSelectModule, AsyncPipe],
  templateUrl: './site-form.component.html',
  styleUrl: './site-form.component.scss'
})
export class SiteFormComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<SiteFormComponent>);
  readonly data = inject<Site | undefined>(MAT_DIALOG_DATA);
  private _fb = inject(FormBuilder);
  // private _treeService = inject(TreesService);
  private _siteService = inject(SitesService);

  form = this._fb.group({
    id: [this.data?.id || null],
    // Assuming 'id' is optional and can be null for new sites
    name: [this.data?.name || '', Validators.required],
    location: [this.data?.location || '', Validators.required],
  });

  isEditMode = !!this.data?.id;

  ngOnInit(): void {

  }

  onConfirmClick(): void {
    this.submit();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
      if (this.form.invalid) return; // TODO: Show validation errors
  
      let dto: CreateSiteDto | UpdateSiteDto;

  
      if (this.isEditMode) {
        dto = createSiteDtoFromForm(this.form);
        this._updateSite(dto);
      } else {
        dto = createSiteDtoFromForm(this.form);
        this._createSite(dto);
      }
  
    }

    private _createSite = (dto: CreateSiteDto) => {
        this._siteService.createSite(dto).subscribe({
            next: (site: Site) => {
              console.log("Site created successfully:", site);
              this.dialogRef.close(site); // Close the dialog and return the created site
            },
            error: (err: any) => {
              console.error("Error creating site:", err);
            }
          });
      }
    
      private _updateSite = (dto: CreateSiteDto) => { // TODO: Fix the type to UpdateSiteDto
        this._siteService.updateSite(this.data!.id, dto).subscribe({
            next: (site: Site) => {
              console.log("Site updated successfully:", site);
              this.dialogRef.close(site); // Close the dialog and return the updated site
            },
            error: (err: any) => {
              console.error("Error updating site:", err);
            }
          });
      }

}
