// Scheme Models for Government Schemes Application

export interface Scheme {
    id: string;
    name: string;
    description: string;
    category: string;
    ministry: string;
    tags?: string[];
    status: 'active' | 'inactive' | 'upcoming';
    isExpanded?: boolean;
    sections?: SchemeSection[];
    actions?: SchemeAction[];
}

export interface SchemeSection {
    title: string;
    content: string;
}

export interface SchemeAction {
    label: string;
    icon: string;
    type: 'primary' | 'secondary';
    color: string;
}

export interface Category {
    name: string;
    icon: string;
    count: string;
}

export interface Update {
    title: string;
    description: string;
    type: 'new' | 'update' | 'alert';
    date: string;
}

export interface QuickLink {
    name: string;
    icon: string;
    count: number | null;
}

export interface EligibilityForm {
    age: string;
    gender: string;
    income: string;
    occupation: string;
    state: string;
}

export interface ApplicationForm {
    fullName: string;
    email: string;
    dob: string;
    phone: string;
    gender: string;
    category: string;
    aadhaar: string;
    pan: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    agreeTerms: boolean;
}

export interface Document {
    name: string;
    uploaded: boolean;
    completed?: boolean; // For application progress tracking
}

export interface TimelineStep {
    title: string;
    status: 'completed' | 'current' | 'pending';
    date: string;
    description: string;
    duration: string;
}

export interface ApplicationProgress {
    schemeName: string;
    appliedDate: string;
    status: string;
    progress: number;
    currentStep: string;
    documents: Document[];
    appointmentDate: string;
    currentPage: number;
    totalPages: number;
    completionPercent: number;
    timeline: TimelineStep[];
}

export interface ChatMessage {
    from: 'user' | 'assistant';
    text: string;
    time?: string;
    isStructured?: boolean;
    structuredData?: any;
    isAccordion?: boolean;
    accordionData?: AccordionData;
}

export interface AccordionData {
    title: string;
    description: string;
    schemes: Scheme[];
}
