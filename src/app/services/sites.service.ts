import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Site } from '@models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  private _http = inject(HttpClient);
  constructor() { }

  getAllSites() {
    return this._http.get<Site[]>(`${environment.baseUrl}/sites`);
  }
}
