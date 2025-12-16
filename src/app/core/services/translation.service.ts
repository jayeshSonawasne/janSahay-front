import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'mr';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private currentLang = new BehaviorSubject<Language>('en');
    currentLang$ = this.currentLang.asObservable();

    private translations: any = {
        en: {
            'app.title': 'Jansahay',
            'menu.title': 'Menu',
            'menu.newChat': 'New Chat',
            'menu.chatHistory': 'Chat History',
            'menu.myApplication': 'My Application',
            'menu.helpSupport': 'Help & Support',
            'menu.recentChats': 'Recent Chats',
            'chat.title': 'JanSahay',
            'chat.subtitle': 'Ask anything about government schemes',
            'chat.loading': 'Researching schemes...',
            'tab.discover': 'Discover',
            'tab.eligibility': 'Eligibility',
            'tab.apply': 'Apply',
            'tab.updates': 'Updates',
            'input.placeholder': 'Ask anything about government schemes...',
            'quickReply.eligible': 'What schemes am I eligible for?',
            'quickReply.housing': 'How to apply for housing subsidy?',
            'quickReply.agriculture': 'Show agriculture schemes',
            'quickReply.status': 'Check application status',
            'welcome.title': 'Namaste, I am JanSahay',
            'welcome.subtitle': 'Your personal assistant for all Government Schemes',
            'welcome.desc': 'I can help you find schemes, check eligibility, and guide you through the application process.',
            'section.categories': 'Browse Categories',
            'section.featured': 'Featured Schemes',
            'section.updates': 'Latest Updates',
            'section.quickLinks': 'Quick Actions',
            'section.eligibility': 'Check Your Eligibility',
            'section.application': 'Application Progress',
            'btn.apply': 'Apply Now',
            'btn.checkEligibility': 'Check Eligibility',
            'btn.details': 'View Details',
            'btn.viewDetails': 'View Details',
            'btn.applyNow': 'Apply Now',
            'btn.checking': 'Checking...',
            'btn.check': 'Check Eligibility',
            'status.pending': 'Pending',
            'status.approved': 'Approved',
            'status.rejected': 'Rejected',
            'label.age': 'Age',
            'label.gender': 'Gender',
            'label.income': 'Annual Income (₹)',
            'label.occupation': 'Occupation',
            'label.state': 'State',
            'placeholder.age': 'Enter your age',
            'placeholder.income': 'Enter annual income',
            'option.selectGender': 'Select gender',
            'option.selectOccupation': 'Select occupation',
            'option.selectState': 'Select state',
            'link.saved': 'Saved Schemes',
            'link.eligibility': 'My Eligibility',
            'link.calculator': 'Calculator',
            'text.schemes': 'schemes',
            'text.quickLinks': 'Quick Links',
            'eligibility.results': 'Eligibility Results',
            'eligibility.match': 'Match',
            // Category names
            'category.farmer': 'Farmer',
            'category.student': 'Student',
            'category.women': 'Women',
            'category.seniorCitizen': 'Senior Citizen',
            // Scheme names
            'scheme.pmay': 'PMAY Housing Scheme',
            'scheme.pmKisan': 'PM Kisan Eligibility',
            'scheme.pmayFull': 'Pradhan Mantri Awas Yojana (PMAY)',
            'scheme.ayushman': 'Ayushman Bharat',
            'scheme.pmKisanFull': 'PM Kisan Samman Nidhi',
            'scheme.skillIndia': 'Skill India Mission',
            // Time references for chat history
            'time.justNow': 'Just now',
            'time.minutesAgo': 'minutes ago',
            'time.hoursAgo': 'hours ago',
            'time.daysAgo': 'days ago',
            'time.yesterday': 'Yesterday',
            // Chat history
            'chat.newConversation': 'New Conversation',
            'chat.noHistory': 'No chat history yet',
            'chat.clearHistory': 'Clear History',
            'chat.lastMessage': 'Last message',
            'chat.messageCount': 'Messages'
        },
        mr: {
            'app.title': 'जनसहाय',
            'menu.title': 'मेनू',
            'menu.newChat': 'नवीन चॅट',
            'menu.chatHistory': 'चॅट इतिहास',
            'menu.myApplication': 'माझे अर्ज',
            'menu.helpSupport': 'मदत आणि समर्थन',
            'menu.recentChats': 'अलीकडील चॅट्स',
            'chat.title': 'जनसहाय',
            'chat.subtitle': 'सरकारी योजनांबद्दल काहीही विचारा',
            'chat.loading': 'योजना शोधत आहे...',
            'tab.discover': 'शोधा',
            'tab.eligibility': 'पात्रता',
            'tab.apply': 'अर्ज करा',
            'tab.updates': 'अपडेट्स',
            'input.placeholder': 'सरकारी योजनांबद्दल काहीही विचारा...',
            'quickReply.eligible': 'मी कोणत्या योजनांसाठी पात्र आहे?',
            'quickReply.housing': 'गृहनिर्माण अनुदानासाठी अर्ज कसा करावा?',
            'quickReply.agriculture': 'कृषी योजना दाखवा',
            'quickReply.status': 'अर्जाची स्थिती तपासा',
            'welcome.title': 'नमस्ते, मी जनसहाय आहे',
            'welcome.subtitle': 'सर्व सरकारी योजनांसाठी तुमचा वैयक्तिक सहाय्यक',
            'welcome.desc': 'मी तुम्हाला योजना शोधण्यात, पात्रता तपासण्यात आणि अर्ज प्रक्रियेत मार्गदर्शन करण्यास मदत करू शकतो.',
            'section.categories': 'श्रेण्या ब्राउझ करा',
            'section.featured': 'वैशिष्ट्यपूर्ण योजना',
            'section.updates': 'नवीनतम अपडेट्स',
            'section.quickLinks': 'जलद कृती',
            'section.eligibility': 'तुमची पात्रता तपासा',
            'section.application': 'अर्ज प्रगती',
            'btn.apply': 'आता अर्ज करा',
            'btn.checkEligibility': 'पात्रता तपासा',
            'btn.details': 'तपशील पहा',
            'btn.viewDetails': 'तपशील पहा',
            'btn.applyNow': 'आता अर्ज करा',
            'btn.checking': 'तपासत आहे...',
            'btn.check': 'पात्रता तपासा',
            'status.pending': 'प्रलंबित',
            'status.approved': 'मंजूर',
            'status.rejected': 'नाकारले',
            'label.age': 'वय',
            'label.gender': 'लिंग',
            'label.income': 'वार्षिक उत्पन्न (₹)',
            'label.occupation': 'व्यवसाय',
            'label.state': 'राज्य',
            'placeholder.age': 'तुमचे वय प्रविष्ट करा',
            'placeholder.income': 'वार्षिक उत्पन्न प्रविष्ट करा',
            'option.selectGender': 'लिंग निवडा',
            'option.selectOccupation': 'व्यवसाय निवडा',
            'option.selectState': 'राज्य निवडा',
            'link.saved': 'जतन केलेल्या योजना',
            'link.eligibility': 'माझी पात्रता',
            'link.calculator': 'कॅल्क्युलेटर',
            'text.schemes': 'योजना',
            'text.quickLinks': 'जलद दुवे',
            'eligibility.results': 'पात्रता परिणाम',
            'eligibility.match': 'जुळणी',
            // Category names
            'category.farmer': 'शेतकरी',
            'category.student': 'विद्यार्थी',
            'category.women': 'महिला',
            'category.seniorCitizen': 'ज्येष्ठ नागरिक',
            // Scheme names
            'scheme.pmay': 'पीएमएवाय गृहनिर्माण योजना',
            'scheme.pmKisan': 'पीएम किसान पात्रता',
            'scheme.pmayFull': 'प्रधानमंत्री आवास योजना (पीएमएवाय)',
            'scheme.ayushman': 'आयुष्मान भारत',
            'scheme.pmKisanFull': 'पीएम किसान सन्मान निधी',
            'scheme.skillIndia': 'स्किल इंडिया मिशन',
            // Time references for chat history
            'time.justNow': 'आत्ताच',
            'time.minutesAgo': 'मिनिटांपूर्वी',
            'time.hoursAgo': 'तासांपूर्वी',
            'time.daysAgo': 'दिवसांपूर्वी',
            'time.yesterday': 'काल',
            // Chat history
            'chat.newConversation': 'नवीन संभाषण',
            'chat.noHistory': 'अद्याप चॅट इतिहास नाही',
            'chat.clearHistory': 'इतिहास साफ करा',
            'chat.lastMessage': 'शेवटचा संदेश',
            'chat.messageCount': 'संदेश'
        }
    };

    constructor() { }

    setLanguage(lang: Language) {
        this.currentLang.next(lang);
    }

    getCurrentLanguage(): Language {
        return this.currentLang.value;
    }

    translate(key: string): string {
        const lang = this.currentLang.value;
        return this.translations[lang][key] || key;
    }
}
