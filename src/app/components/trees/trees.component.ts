import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Tree } from '@models';
import { TreesService } from 'app/services/trees.service';
import { BehaviorSubject } from 'rxjs';
import { TreeFormComponent } from '../tree-form/tree-form.component';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-trees',
  imports: [AsyncPipe, JsonPipe, MatButtonModule, MatIconModule, MatTableModule, DatePipe],
  templateUrl: './trees.component.html',
  styleUrl: './trees.component.scss'
})
export class TreesComponent implements OnInit {
  private treeService = inject(TreesService);

  private _trees$ = new BehaviorSubject<Tree[]>([]);

  readonly dialog = inject(MatDialog);

  trees$ = this._trees$.asObservable();

  dataSource = new MatTableDataSource<Partial<Tree>>();

  displayedColumns: string[] = ['id', 'species', 'plantedAt', 'status', 'zone', 'actions'];

  @ViewChild(MatTable) table!: MatTable<Tree>;

  private _loadTrees() {
    this.treeService.getAllTrees().subscribe({
      next: (trees: Tree[]) => {
        console.log('Trees loaded:', trees);
        this.dataSource.data = trees; // Update the data source for the table
        // this.table.renderRows(); // Refresh the table view
        this._trees$.next(trees);
      },
      error: (err) => {
        console.error('Error loading trees:', err);
      }
    });
  }
  
  // Lifecycle hook to load trees when the component is initialized   
  ngOnInit() {
    this._loadTrees();
  }

  createTree() {
    console.log('Create tree button clicked');
    const dialogRef = this.dialog.open(TreeFormComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Tree created:', result);
        this._loadTrees(); // Reload trees after creation
      } else {
        console.log('Tree creation cancelled');
      }
    });
  }

  editTree(tree: Tree) {
    console.log('Edit tree button clicked for tree:', tree);
    const dialogRef = this.dialog.open(TreeFormComponent, {
      data: tree
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Tree updated:', result);
        this._loadTrees(); // Reload trees after update
      } else {
        console.log('Tree update cancelled');
      }
    });
  }
  
  deleteTree(tree: Tree) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Tree',
        message: `Are you sure you want to delete the tree with ID ${tree.id}?`
      }});

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Tree deleted:', tree);
          this.treeService.deleteTree(tree.id).subscribe({
            next: () => {
              console.log('Tree deleted successfully'); // TODO: Show success message
              this._loadTrees(); // Reload trees after deletion
            },
            error: (err) => {
              console.error('Error deleting tree:', err); // TODO: Show error message
            }
          });
        }
      });
  }


}
