import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { EnvironmentReading } from '@models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentReadingsService {

private _http = inject(HttpClient);
  constructor() { }

  getAllReadings() {
    return this._http.get<EnvironmentReading[]>(`${environment.baseUrl}/environment-readings`);
  }

  getReadingsByDeviceId(deviceId: string) {
    return this._http.get<EnvironmentReading[]>(`${environment.baseUrl}/environment-readings/device/${deviceId}`)
  }
}
