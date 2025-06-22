import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateSiteDto, Site } from '@models';
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

  createSite(site: CreateSiteDto) {
    return this._http.post<Site>(`${environment.baseUrl}/sites`, site);
  }

  updateSite(id: number, site: CreateSiteDto) { // TODO: Update the type to UpdateSiteDto if needed
    return this._http.put<Site>(`${environment.baseUrl}/sites/${id}`, site);
  }

  deleteSite(id: number) {
    return this._http.delete<void>(`${environment.baseUrl}/sites/${id}`);
  }
}
