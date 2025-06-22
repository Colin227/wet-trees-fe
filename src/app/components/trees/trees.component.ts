import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Tree } from '@models';
import { TreesService } from 'app/services/trees.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-trees',
  imports: [AsyncPipe, JsonPipe, MatButtonModule, MatIconModule],
  templateUrl: './trees.component.html',
  styleUrl: './trees.component.scss'
})
export class TreesComponent implements OnInit {
  private treeService = inject(TreesService);

  private _trees$ = new BehaviorSubject<Tree[]>([]);

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


}
