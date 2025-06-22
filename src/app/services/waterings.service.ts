import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WateringEvent } from '@models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WateringsService {

  private _http = inject(HttpClient);
  constructor() { }

  getAllWaterings() {
    return this._http.get<WateringEvent[]>(`${environment.baseUrl}/trees`);
  }
}
