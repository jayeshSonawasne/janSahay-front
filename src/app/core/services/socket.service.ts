import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;
    private readonly URL = 'https://jansahay.onrender.com/'; // Adjust if backend runs on a different port

    constructor() {
        this.socket = io(this.URL);

        this.socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });
    }

    // Join a room
    joinRoom(roomId: string, userId: string) {
        this.socket.emit('join-room', roomId, userId);
    }

    // WebRTC Signaling
    emitOffer(data: { offer: any, roomId: string }) {
        this.socket.emit('offer', data);
    }

    emitAnswer(data: { answer: any, roomId: string }) {
        this.socket.emit('answer', data);
    }

    emitIceCandidate(data: { candidate: any, roomId: string }) {
        this.socket.emit('ice-candidate', data);
    }

    // Listeners
    onUserConnected(): Observable<string> {
        return new Observable(observer => {
            this.socket.on('user-connected', (userId) => {
                observer.next(userId);
            });
        });
    }

    onUserDisconnected(): Observable<string> {
        return new Observable(observer => {
            this.socket.on('user-disconnected', (userId) => {
                observer.next(userId);
            });
        });
    }

    onOffer(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('offer', (offer) => {
                observer.next(offer);
            });
        });
    }

    onAnswer(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('answer', (answer) => {
                observer.next(answer);
            });
        });
    }

    onIceCandidate(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('ice-candidate', (candidate) => {
                observer.next(candidate);
            });
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
