import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, ReplaySubject } from 'rxjs';
import { EnvironmentReading } from '@models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private _reading$ = new ReplaySubject<EnvironmentReading>(1);

  constructor() {
    this.socket = io(`${environment.websocketUrl}`);
    this.socket.on('new-reading', (data: EnvironmentReading) => {
      this._reading$.next(data);
    });
  }

  getLatestReading(): Observable<EnvironmentReading> {
    return this._reading$.asObservable();
  }
}
