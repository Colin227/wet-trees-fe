import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Zone } from '@models';
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
}
