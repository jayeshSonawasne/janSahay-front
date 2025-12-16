import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Scheme, Category, Update, QuickLink } from '../models/scheme.model';

/**
 * SchemeService - Manages all government scheme related data
 * 
 * CURRENT STATUS: Contains MOCK DATA for development/demo
 * 
 * TODO FOR PRODUCTION:
 * 1. Import HttpClient: import { HttpClient } from '@angular/common/http';
 * 2. Import environment: import { environment } from '../../../environments/environment';
 * 3. Add to constructor: constructor(private http: HttpClient) { }
 * 4. Replace mock data returns with: this.http.get<Type>(`${environment.apiUrl}/endpoint`)
 */
@Injectable({
    providedIn: 'root'
})
export class SchemeService {

    constructor() { }

    /**
     * Get all categories (Farmer, Student, Women, etc.)
     */
    getCategories(): Observable<Category[]> {
        const categories: Category[] = [
            { name: 'category.farmer', icon: 'bi-tree', count: '12' },
            { name: 'category.student', icon: 'bi-mortarboard', count: '8' },
            { name: 'category.women', icon: 'bi-gender-female', count: '15' },
            { name: 'category.seniorCitizen', icon: 'bi-person', count: '6' }
        ];
        return of(categories).pipe(delay(300));
    }

    /**
     * Get featured schemes for homepage
     */
    getFeaturedSchemes(): Observable<Scheme[]> {
        const schemes: Scheme[] = [
            {
                id: '1',
                name: 'Pradhan Mantri Awas Yojana (PMAY)',
                description: 'Housing for all provides affordable housing to urban and rural poor with interest subsidies.',
                category: 'Housing',
                ministry: 'Ministry of Housing and Urban Affairs',
                tags: ['Housing', 'Urban', 'Subsidy'],
                status: 'active'
            },
            {
                id: '2',
                name: 'Ayushman Bharat',
                description: 'Health insurance coverage of ₹5 lakh per family per year for secondary and tertiary care.',
                category: 'Healthcare',
                ministry: 'Ministry of Health and Family Welfare',
                tags: ['Healthcare', 'Insurance'],
                status: 'active'
            },
            {
                id: '3',
                name: 'PM Kisan Samman Nidhi',
                description: 'Income support of ₹6000/year to all farmer families in three equal installments.',
                category: 'Agriculture',
                ministry: 'Ministry of Agriculture',
                tags: ['Agriculture', 'Direct Benefit', 'Rural'],
                status: 'active'
            },
            {
                id: '4',
                name: 'Skill India Mission',
                description: 'Skill development and certification programs to enhance employability.',
                category: 'Education',
                ministry: 'Ministry of Skill Development',
                tags: ['Education', 'Employment', 'Youth'],
                status: 'active'
            }
        ];
        return of(schemes).pipe(delay(500));
    }

    /**
     * Get all available schemes
     */
    getAllSchemes(): Observable<Scheme[]> {
        const schemes: Scheme[] = [
            {
                id: '1',
                name: 'Pradhan Mantri Awas Yojana (PMAY)',
                description: 'Affordable housing scheme providing financial assistance.',
                category: 'Housing',
                ministry: 'Ministry of Housing and Urban Affairs',
                tags: ['Housing', 'Subsidy', 'Urban'],
                status: 'active'
            },
            {
                id: '2',
                name: 'Ayushman Bharat - PM-JAY',
                description: 'Health insurance scheme providing coverage of ₹5 lakhs per family.',
                category: 'Healthcare',
                ministry: 'Ministry of Health',
                tags: ['Healthcare', 'Insurance'],
                status: 'active'
            },
            {
                id: '3',
                name: 'PM Kisan Samman Nidhi',
                description: 'Direct income support of ₹6000 per year to farmer families.',
                category: 'Agriculture',
                ministry: 'Ministry of Agriculture',
                tags: ['Agriculture', 'Farmer', 'Income'],
                status: 'active'
            }
        ];
        return of(schemes).pipe(delay(800));
    }

    /**
     * Get schemes filtered by category
     */
    getSchemesByCategory(_category: string): Observable<Scheme[]> {
        // For demo, return sample schemes
        const schemes: Scheme[] = [
            {
                id: '1',
                name: 'Pradhan Mantri Awas Yojana',
                description: 'Affordable housing for all',
                category: 'Housing',
                ministry: 'MoHUA',
                tags: ['Housing'],
                status: 'active'
            }
        ];
        return of(schemes).pipe(delay(400));
    }

    /**
     * Get detailed information for a specific scheme
     */
    getSchemeById(_id: string): Observable<Scheme | undefined> {
        const scheme: Scheme = {
            id: '1',
            name: 'Pradhan Mantri Awas Yojana (PMAY)',
            description: 'Comprehensive housing scheme for urban and rural poor.',
            category: 'Housing',
            ministry: 'Ministry of Housing and Urban Affairs',
            tags: ['Housing', 'Subsidy', 'Urban', 'Rural'],
            status: 'active'
        };
        return of(scheme).pipe(delay(300));
    }

    /**
     * Get latest news and updates about schemes
     */
    getUpdates(): Observable<Update[]> {
        const updates: Update[] = [
            {
                title: 'New PM Vishwakarma Scheme Launched',
                description: 'Financial support and skill training for traditional artisans',
                type: 'new',
                date: '2 hours ago'
            },
            {
                title: 'Digital Ration Card Rollout',
                description: 'One Nation One Ration Card now available in all states',
                type: 'update',
                date: '1 day ago'
            },
            {
                title: 'PMAY Deadline Extended',
                description: 'Application deadline extended till March 2026',
                type: 'alert',
                date: '3 days ago'
            }
        ];
        return of(updates).pipe(delay(300));
    }

    /**
     * Get quick action links
     */
    getQuickLinks(): Observable<QuickLink[]> {
        const links: QuickLink[] = [
            { name: 'Saved Schemes', icon: 'bi-bookmark', count: 9 },
            { name: 'My Eligibility', icon: 'bi-person-check', count: 9 },
            { name: 'Calculator', icon: 'bi-calculator', count: null }
        ];
        return of(links).pipe(delay(200));
    }

    /**
     * Search schemes by keyword
     */
    searchSchemes(_query: string): Observable<Scheme[]> {
        // For demo, return all schemes
        return this.getAllSchemes();
    }
}
