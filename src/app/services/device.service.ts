import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateDeviceDto, Device, UpdateDeviceDto } from 'app/models/devices';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private _http = inject(HttpClient);
  constructor() { }

  getAllDevices() {
    return this._http.get<Device[]>(`${environment.baseUrl}/devices`);
  }

  createDevice(device: CreateDeviceDto) {
    return this._http.post<Device>(`${environment.baseUrl}/devices`, device);
  }

  updateDevice(device: UpdateDeviceDto) {
    return this._http.put<Device>(`${environment.baseUrl}/devices/${device.deviceId}`, device);
  }
}
