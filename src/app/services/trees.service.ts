import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
      

import { environment } from '../../environments/environment';
import { CreateTreeDto, Tree } from '@models';


    

@Injectable({
  providedIn: 'root'
})
export class TreesService {
  private _http = inject(HttpClient);
  constructor() { }

  getAllTrees() {
    return this._http.get<Tree[]>(`${environment.baseUrl}/trees`);
  }

  createTree(treeDto: CreateTreeDto) {
    return this._http.post<Tree>(`${environment.baseUrl}/trees`, treeDto);
  }
}
