import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatMessage, AccordionData } from '../models/scheme.model';

@Injectable({
    providedIn: 'root'
})
export class ChatbotService {

    private messages: ChatMessage[] = [];

    constructor() { }

    /**
     * Get all chat messages
     */
    getMessages(): ChatMessage[] {
        return this.messages;
    }

    /**
     * Add a user message
     */
    addUserMessage(text: string): void {
        this.messages.push({
            from: 'user',
            text,
            time: this.getCurrentTime()
        });
    }

    /**
     * Add an assistant message
     */
    addAssistantMessage(
        text: string,
        isStructured: boolean = false,
        structuredData: any = null,
        isAccordion: boolean = false,
        accordionData: AccordionData | undefined = undefined
    ): void {
        this.messages.push({
            from: 'assistant',
            text,
            time: this.getCurrentTime(),
            isStructured,
            structuredData,
            isAccordion,
            accordionData
        });
    }

    /**
     * Clear all messages
     */
    clearMessages(): void {
        this.messages = [];
    }

    /**
     * Get current time formatted
     */
    private getCurrentTime(): string {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Generate AI response based on query
     * TODO: Replace with actual AI API call
     */
    generateResponse(query: string): Observable<string> {
        console.log('Generating response for query:', query);
        // Return empty response - connect to your AI API here
        return of('I apologize, but I am not connected to the backend yet. Please connect the API to enable responses.');
    }

    /**
     * Check if query should show complex response
     */
    shouldShowComplexResponse(query: string): boolean {
        const complexKeywords = [
            'scheme', 'eligibility', 'apply', 'benefits', 'subsidy',
            'housing', 'agriculture', 'farmer', 'student', 'women',
            'details', 'information', 'show', 'list', 'find', 'check'
        ];

        return complexKeywords.some(keyword =>
            query.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    /**
     * Get update details by title
     * TODO: Replace with actual API call
     */
    getUpdateDetails(title: string): string {
        console.log('Fetching update details for:', title);
        return 'Detailed information is not available. Please connect to the API.';
    }

    /**
     * Generate eligibility explanation
     * TODO: Replace with actual API call
     */
    generateEligibilityExplanation(schemeName: string, percentage: string): string {
        return `Eligibility information for ${schemeName} is not available. Please connect to the API to get detailed eligibility criteria.`;
    }
}
