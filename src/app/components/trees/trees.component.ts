import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Tree } from '@models';
import { TreesService } from 'app/services/trees.service';
import { BehaviorSubject } from 'rxjs';
import { TreeFormComponent } from '../tree-form/tree-form.component';

@Component({
  selector: 'app-trees',
  imports: [AsyncPipe, JsonPipe, MatButtonModule, MatIconModule],
  templateUrl: './trees.component.html',
  styleUrl: './trees.component.scss'
})
export class TreesComponent implements OnInit {
  private treeService = inject(TreesService);

  private _trees$ = new BehaviorSubject<Tree[]>([]);

  readonly dialog = inject(MatDialog);

  trees$ = this._trees$.asObservable();

  private _loadTrees() {
    this.treeService.getAllTrees().subscribe({
      next: (trees: Tree[]) => {
        console.log('Trees loaded:', trees);
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


}
