import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardStats, WateringCoverage } from '@models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _http: HttpClient;
  constructor(http: HttpClient) {
    this._http = http;
  }

  getStats(): Observable<DashboardStats> {
    return this._http.get<DashboardStats>('/api/dashboard/stats');
  }

  getWateringCoverage(): Observable<WateringCoverage> {
    return this._http.get<WateringCoverage>('/api/dashboard/wateringCoverage');
  }

}
