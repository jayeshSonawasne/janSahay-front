import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ApplicationProgress, ApplicationForm, Document } from '../models/scheme.model';

/**
 * ApplicationService - Manages application submissions and progress tracking
 * 
 * CURRENT STATUS: Contains MOCK DATA for development/demo
 * 
 * TODO FOR PRODUCTION:
 * 1. Import HttpClient: import { HttpClient } from '@angular/common/http';
 * 2. Import environment: import { environment } from '../../../environments/environment';
 * 3. Add to constructor: constructor(private http: HttpClient) { }
 * 4. Replace mock data returns with actual HTTP calls
 */
@Injectable({
    providedIn: 'root'
})
export class ApplicationService {

    constructor() { }

    /**
     * Get application progress for current user
     * Returns: Application progress with timeline
     */
    getApplicationProgress(_userId?: string): Observable<ApplicationProgress | null> {
        const progress: ApplicationProgress = {
            schemeName: 'PMAY Urban',
            appliedDate: 'Jan 16, 2025',
            status: 'Pending',
            progress: 31,
            currentStep: 'Step 2 of 4',
            documents: [
                { name: 'Aadhaar Card', uploaded: false, completed: false },
                { name: 'Income Certificate', uploaded: true, completed: true },
                { name: 'Address Proof', uploaded: true, completed: true }
            ],
            appointmentDate: 'Dec 28, 2024',
            currentPage: 3,
            totalPages: 3,
            completionPercent: 100,
            timeline: [
                {
                    title: 'Application Submitted',
                    status: 'completed',
                    date: 'Jan 16, 2025',
                    description: 'Application successfully submitted and under initial review',
                    duration: '2 days'
                },
                {
                    title: 'Document Verification',
                    status: 'current',
                    date: 'Jan 18, 2025 - Present',
                    description: 'Documents being verified by authorities',
                    duration: 'Current'
                },
                {
                    title: 'Field Inspection & Site Visit',
                    status: 'pending',
                    date: 'Dec 28, 2024',
                    description: 'Site visit scheduled for property verification',
                    duration: 'Scheduled'
                },
                {
                    title: 'Approval & Subsidy Disbursement',
                    status: 'pending',
                    date: 'Estimated: Feb 15, 2025',
                    description: 'Final approval and subsidy disbursement',
                    duration: 'Next Step'
                }
            ]
        };
        return of(progress).pipe(delay(500));
    }

    /**
     * Submit a new application
     * Returns: Success status and application ID
     */
    submitApplication(_form: ApplicationForm, _schemeId: string): Observable<{ success: boolean; applicationId: string }> {
        const applicationId = `APP${Date.now().toString().slice(-6)}`;
        return of({ success: true, applicationId }).pipe(delay(2000));
    }

    /**
     * Upload a document file
     * Returns: Success status and file URL
     */
    uploadDocument(file: File, _documentType: string): Observable<{ success: boolean; url: string }> {
        return of({
            success: true,
            url: `https://storage.example.com/documents/${file.name}`
        }).pipe(delay(1000));
    }

    /**
     * Get list of required documents for a scheme
     * Returns: Array of required documents
     */
    getRequiredDocuments(_schemeId: string): Observable<Document[]> {
        const documents: Document[] = [
            { name: 'Aadhaar Card', uploaded: false },
            { name: 'PAN Card', uploaded: false },
            { name: 'Income Certificate', uploaded: false },
            { name: 'Address Proof', uploaded: false },
            { name: 'Passport Photo', uploaded: false }
        ];
        return of(documents).pipe(delay(300));
    }

    /**
     * Check status of an application
     * Returns: Current status and progress percentage
     */
    checkApplicationStatus(_applicationId: string): Observable<{ status: string; progress: number }> {
        return of({
            status: 'Under Review',
            progress: 45
        }).pipe(delay(1000));
    }

    /**
     * Download application as PDF
     * Returns: PDF blob
     */
    downloadApplicationPDF(_applicationId: string): Observable<Blob> {
        return of(new Blob(['Application PDF content'], { type: 'application/pdf' }))
            .pipe(delay(2000));
    }

    /**
     * Reschedule an appointment
     * Returns: Success status
     */
    rescheduleAppointment(_applicationId: string, _newDate: Date): Observable<{ success: boolean }> {
        return of({ success: true }).pipe(delay(1500));
    }

    /**
     * Get appointment details
     * Returns: Appointment information
     */
    getAppointmentDetails(_applicationId: string): Observable<any> {
        const appointment = {
            date: 'December 28, 2024',
            time: '10:00 AM - 1:00 PM',
            officer: 'Mr. Sharma (Field Inspector)',
            contact: '+91-9876543210',
            address: 'Your registered property address'
        };
        return of(appointment).pipe(delay(500));
    }

    /**
     * Get subsidy calculation details for a scheme
     * Returns: Subsidy details
     */
    getSubsidyDetails(_schemeId: string): Observable<any> {
        const subsidy = {
            eligibleSubsidy: '₹2.67 lakhs',
            creditLinkedSubsidy: '6.5% interest',
            loanAmount: '₹6 lakhs',
            disbursement: 'Within 15 days of approval',
            propertyType: 'Affordable Housing'
        };
        return of(subsidy).pipe(delay(500));
    }
}
