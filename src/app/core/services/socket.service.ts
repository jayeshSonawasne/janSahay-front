import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;
    private readonly URL = 'https://jansahay.onrender.com/';
    // private readonly URL = 'http://localhost:8585';

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

    leaveRoom(roomId: string, userId: string) {
        this.socket.emit('leave-room', roomId, userId);
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

    callUser(data: { roomId: string, from: string }) {
        this.socket.emit('call-user', data);
    }

    onIncomingCall(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('incoming-call', (data) => {
                observer.next(data);
            });
        });
    }

    answerCall(data: { roomId: string }) {
        this.socket.emit('answer-call', data);
    }

    onCallAccepted(): Observable<any> {
        return new Observable(observer => {
            this.socket.on('call-accepted', (data) => {
                observer.next(data);
            });
        });
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
