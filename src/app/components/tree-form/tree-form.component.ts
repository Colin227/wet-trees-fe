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
import { CreateTreeDto, Site, Tree, UpdateTreeDto } from '@models';
import { createTreeDtoFromForm } from 'app/utils/tree.dto-factories';
import { TreesService } from 'app/services/trees.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { SitesService } from 'app/services/sites.service';

@Component({
  selector: 'app-tree-form',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogModule, ReactiveFormsModule, MatDatepickerModule, MatOptionModule, MatSelectModule, AsyncPipe],
  templateUrl: './tree-form.component.html',
  styleUrl: './tree-form.component.scss'
})
export class TreeFormComponent implements OnInit {

  readonly dialogRef = inject(MatDialogRef<TreeFormComponent>);
  readonly data = inject<Tree | undefined>(MAT_DIALOG_DATA);
  private _fb = inject(FormBuilder);
  private _treeService = inject(TreesService);
  private _siteService = inject(SitesService); // Assuming TreesService has a method to get sites

  sites$!: Observable<Site[]>;

  form = this._fb.group({
    species: [this.data?.species || '', Validators.required],
    plantedAt: [this.data?.plantedAt || new Date(), Validators.required],
    status: [this.data?.status || 'healthy', Validators.required],
    siteId: [this.data?.site?.id || null, Validators.required],
  });

  isEditMode = !!this.data?.id;

  constructor() {}

  ngOnInit(): void {
    this.sites$ = this._siteService.getAllSites();
  }

  onConfirmClick(): void {
    // if (this.form.invalid) {
    //   console.error("Form is invalid, cannot confirm.");
    //   return;
    // }

    
    // // if form is valid, close with current form data
    // console.log("On confirm click, ", this.form.value);
    this.submit();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) return;

    let dto: CreateTreeDto | UpdateTreeDto;

    if (this.isEditMode) {
      throw new Error("Edit mode is not implemented yet.");
    } else {
      dto = createTreeDtoFromForm(this.form);
      this._createTree(dto);
    }

  }

  private _createTree = (dto: CreateTreeDto) => {
    this._treeService.createTree(dto).subscribe({
        next: (tree: Tree) => {
          console.log("Tree created successfully:", tree);
          this.dialogRef.close(tree); // Close the dialog and return the created tree
        },
        error: (err: any) => {
          console.error("Error creating tree:", err);
        }
      });
  }

  private _updateTree = (dto: UpdateTreeDto) => {
    // this._treeService.updateTree(dto).subscribe({
    //   next: (tree: Tree) => {
    //     console.log("Tree updated successfully:", tree);
    //   },
    //   error: (err: any) => {
    //     console.error("Error updating tree:", err);
    //   }
    // });
    throw new Error("Update tree is not implemented yet.");
  }
}
