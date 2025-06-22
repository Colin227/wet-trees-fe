import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateZoneDto, Zone } from '@models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  private _http = inject(HttpClient);
  constructor() { }

  getAllZones() {
    return this._http.get<Zone[]>(`${environment.baseUrl}/zones`);
  }

  createZone(zone: CreateZoneDto) {
    return this._http.post<Zone>(`${environment.baseUrl}/zones`, zone);
  }

  updateZone(id: number, zone: CreateZoneDto) {
    return this._http.put<Zone>(`${environment.baseUrl}/zones/${id}`, zone);
  }

  deleteZone(id: number) {
    return this._http.delete<void>(`${environment.baseUrl}/zones/${id}`);
  }
  getZoneById(id: number) {
    return this._http.get<Zone>(`${environment.baseUrl}/zones/${id}`);
  }


  getZonesBySiteId(siteId: number) {
    return this._http.get<Zone[]>(`${environment.baseUrl}/zones?siteId=${siteId}`);
  }
}
