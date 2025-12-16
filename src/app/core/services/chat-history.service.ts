import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatHistoryEntry } from '../models/chat-history.model';

@Injectable({
    providedIn: 'root'
})
export class ChatHistoryService {
    private readonly STORAGE_KEY = 'chat_history';
    private readonly MAX_HISTORY_ITEMS = 10;

    private chatHistorySubject = new BehaviorSubject<ChatHistoryEntry[]>([]);
    public chatHistory$ = this.chatHistorySubject.asObservable();

    constructor() {
        this.loadHistory();
    }

    /**
     * Load chat history from localStorage
     */
    private loadHistory(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            try {
                const history = JSON.parse(stored);
                // Convert timestamp strings back to Date objects
                const parsedHistory = history.map((entry: any) => ({
                    ...entry,
                    timestamp: new Date(entry.timestamp)
                }));
                this.chatHistorySubject.next(parsedHistory);
            } catch (error) {
                console.error('Error loading chat history:', error);
                this.chatHistorySubject.next([]);
            }
        }
    }

    /**
     * Get all chat history entries
     */
    getChatHistory(): ChatHistoryEntry[] {
        return this.chatHistorySubject.value;
    }

    /**
     * Save a new chat to history
     */
    saveChat(title: string, lastMessage: string, messageCount: number): string {
        const history = this.chatHistorySubject.value;
        const chatId = this.generateChatId();

        const newEntry: ChatHistoryEntry = {
            id: chatId,
            title: title,
            timestamp: new Date(),
            lastMessage: lastMessage,
            messageCount: messageCount
        };

        // Add to beginning of array (most recent first)
        const updatedHistory = [newEntry, ...history];

        // Keep only MAX_HISTORY_ITEMS
        const trimmedHistory = updatedHistory.slice(0, this.MAX_HISTORY_ITEMS);

        // Save to storage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedHistory));
        this.chatHistorySubject.next(trimmedHistory);

        return chatId;
    }

    /**
     * Update an existing chat entry
     */
    updateChat(chatId: string, title: string, lastMessage: string, messageCount: number): void {
        const history = this.chatHistorySubject.value;
        const index = history.findIndex(entry => entry.id === chatId);

        if (index !== -1) {
            history[index] = {
                ...history[index],
                title: title,
                lastMessage: lastMessage,
                messageCount: messageCount,
                timestamp: new Date()
            };

            // Move updated chat to top
            const updatedEntry = history.splice(index, 1)[0];
            const updatedHistory = [updatedEntry, ...history];

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
            this.chatHistorySubject.next(updatedHistory);
        }
    }

    /**
     * Delete a chat from history
     */
    deleteChat(chatId: string): void {
        const history = this.chatHistorySubject.value;
        const updatedHistory = history.filter(entry => entry.id !== chatId);

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
        this.chatHistorySubject.next(updatedHistory);
    }

    /**
     * Clear all chat history
     */
    clearHistory(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.chatHistorySubject.next([]);
    }

    /**
     * Generate unique chat ID
     */
    private generateChatId(): string {
        return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get relative time string (e.g., "2 hours ago")
     */
    getRelativeTime(timestamp: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - new Date(timestamp).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
        if (diffHours < 24) return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return new Date(timestamp).toLocaleDateString();
    }
}
