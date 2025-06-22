import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateWateringDto, WateringEvent } from '@models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WateringsService {

  private _http = inject(HttpClient);
  constructor() { }

  getAllWaterings() {
    return this._http.get<WateringEvent[]>(`${environment.baseUrl}/watering-events`);
  }

  createWatering(watering: CreateWateringDto) {
    return this._http.post<WateringEvent>(`${environment.baseUrl}/watering-events`, watering);
  }

  updateWatering(id: number, watering: CreateWateringDto) {
    return this._http.put<WateringEvent>(`${environment.baseUrl}/watering-events/${id}`, watering);
  }

  deleteWatering(id: number) {
    return this._http.delete<void>(`${environment.baseUrl}/watering-events/${id}`);
  }
}
