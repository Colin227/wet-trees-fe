import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { EnvironmentReading } from '@models';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor() {
    this.socket = io(`${environment.websocketUrl}`); // Update with backend host if needed
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  onMessage(callback: (message: EnvironmentReading) => void): void {
    this.socket.on('new-reading', callback);
  }
}
