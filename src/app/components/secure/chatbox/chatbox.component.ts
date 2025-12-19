// chatbox.component.ts - REFACTORED WITH DYNAMIC SERVICES
import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// Import services
import { SchemeService } from '../../../core/services/scheme.service';
import { ApplicationService } from '../../../core/services/application.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ChatHistoryService } from '../../../core/services/chat-history.service';

// Import pipes
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

// Import models
import { ChatHistoryEntry } from '../../../core/models/chat-history.model';
import {
  Scheme,
  Category,
  Update,
  QuickLink,
  ChatMessage,
  ApplicationForm,
  ApplicationProgress,
  Document
} from '../../../core/models/scheme.model';

declare var bootstrap: any;

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('talkToExpertModal', { static: false }) talkToExpertModal: any;
  @ViewChild('callModal', { static: false }) callModal: any;
  @ViewChild('applySchemeModal', { static: false }) applySchemeModal: any;
  @ViewChild('videoCallModal', { static: false }) videoCallModal: any;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;

  // Media Stream
  private localStream: MediaStream | null = null;

  // Subscriptions for cleanup
  private subscriptions: Subscription = new Subscription();

  // Responsive State
  isSidebarOpen = false;
  isRightPanelOpen = false;

  isShrink = false;
  activeTab: 'discover' | 'eligibility' | 'apply' | 'updates' = 'discover';
  showEligibilityResults = false;

  // Loading states
  isLoading = false;
  loadingAction: string | null = null;
  isGeneratingResponse = false;
  isConnectingCall = false;
  isStartingVideoCall = false;

  // Response timing - realistic delays
  responseDelay = 1500; // Reduced for faster perceived response start
  complexResponseDelay = 2000;
  processingDelay = 800;
  typingSpeed = 30; // ms per char

  // Application Modal Properties
  currentApplyStep = 1;
  showSuccessAnimation = false;
  selectedScheme: Scheme | null = null;

  // Application Form
  applicationForm: ApplicationForm = {
    fullName: '',
    email: '',
    dob: '',
    phone: '',
    gender: '',
    category: '',
    aadhaar: '',
    pan: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    agreeTerms: false
  };

  // Required Documents - will be loaded from service
  requiredDocuments: Document[] = [];

  // UI state
  message: string = '';
  quickReplies: string[] = [
    'quickReply.eligible',
    'quickReply.housing',
    'quickReply.agriculture',
    'quickReply.status'
  ];
  selectedQuick: string | null = null;

  // Chat messages - managed by ChatbotService
  messages: ChatMessage[] = [];

  // Track expanded accordion items
  expandedAccordions: Set<string> = new Set();

  // Call related properties
  currentCallExpert: string = '';
  callConnected: boolean = false;
  callTimer: string = '00:00';
  isMuted: boolean = false;
  isSpeakerOn: boolean = false;
  callInterval: any;
  callStartTime: Date = new Date();

  // Video Call related properties
  videoCallTimer: string = '00:00';
  isVideoOn: boolean = true;
  videoCallInterval: any;
  videoCallStartTime: Date = new Date();
  isVideoMinimized: boolean = false;

  // Dynamic data loaded from services
  categories: Category[] = [];
  featuredSchemes: Scheme[] = [];
  updates: Update[] = [];
  quickLinks: QuickLink[] = [];

  // Eligibility form data
  eligibilityForm = {
    age: '',
    gender: '',
    income: '',
    occupation: '',
    state: ''
  };

  // Voice Input State
  isVoiceInputActive = false;
  @ViewChild('chatInput') chatInput!: ElementRef;

  // Theme State
  isDarkMode = false; // Default light mode for this component initially, or load from service

  // Application progress data - loaded from service
  applicationProgress: ApplicationProgress | null = null;

  // Modal instances
  private talkToExpertModalInstance: any;
  private callModalInstance: any;
  private applySchemeModalInstance: any;
  private videoCallModalInstance: any;

  // Chat history
  chatHistory: ChatHistoryEntry[] = [];
  currentChatId: string | null = null;

  constructor(
    private schemeService: SchemeService,
    private applicationService: ApplicationService,
    public translationService: TranslationService,
    private chatHistoryService: ChatHistoryService
  ) { }

  ngOnInit() {
    // Load initial data from services
    this.loadCategories();
    this.loadFeaturedSchemes();
    this.loadUpdates();
    this.loadQuickLinks();
    this.loadApplicationProgress();
    this.loadRequiredDocuments();
    this.loadChatHistory();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.stopCallTimer();
    this.stopVideoCallTimer();
    this.stopLocalVideo();
  }

  // Data loading methods
  private loadCategories() {
    this.subscriptions.add(
      this.schemeService.getCategories().subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Error loading categories', err);
          this.categories = [];
        }
      })
    );
  }

  private loadFeaturedSchemes() {
    this.subscriptions.add(
      this.schemeService.getFeaturedSchemes().subscribe({
        next: (data) => {
          this.featuredSchemes = data;
        },
        error: (err) => {
          console.error('Error loading featured schemes', err);
          this.featuredSchemes = [];
        }
      })
    );
  }

  private loadUpdates() {
    this.subscriptions.add(
      this.schemeService.getUpdates().subscribe({
        next: (data) => {
          this.updates = data;
        },
        error: (err) => {
          console.error('Error loading updates', err);
          this.updates = [];
        }
      })
    );
  }

  private loadQuickLinks() {
    this.subscriptions.add(
      this.schemeService.getQuickLinks().subscribe({
        next: (data) => {
          this.quickLinks = data;
        },
        error: (err) => {
          console.error('Error loading quick links', err);
          this.quickLinks = [];
        }
      })
    );
  }

  private loadApplicationProgress() {
    this.subscriptions.add(
      this.applicationService.getApplicationProgress().subscribe({
        next: (data) => {
          this.applicationProgress = data;
        },
        error: (err) => {
          console.error('Error loading application progress', err);
          this.applicationProgress = null;
        }
      })
    );
  }

  private loadRequiredDocuments() {
    this.subscriptions.add(
      this.applicationService.getRequiredDocuments('pmay').subscribe({
        next: (data) => {
          this.requiredDocuments = data;
        },
        error: (err) => {
          console.error('Error loading required documents', err);
          this.requiredDocuments = [];
        }
      })
    );
  }

  ngAfterViewInit() {
    // Initialize modal instances after view is initialized
    if (this.talkToExpertModal) {
      this.talkToExpertModalInstance = new bootstrap.Modal(this.talkToExpertModal.nativeElement);
    }
    if (this.callModal) {
      this.callModalInstance = new bootstrap.Modal(this.callModal.nativeElement);
    }
    if (this.applySchemeModal) {
      this.applySchemeModalInstance = new bootstrap.Modal(this.applySchemeModal.nativeElement);
    }
    if (this.videoCallModal) {
      this.videoCallModalInstance = new bootstrap.Modal(this.videoCallModal.nativeElement);
    }
  }

  // Application Modal Methods
  openApplyModal(scheme?: any) {
    this.selectedScheme = scheme;
    this.currentApplyStep = 1;
    this.showSuccessAnimation = false;

    // Reset form
    this.applicationForm = {
      fullName: '',
      email: '',
      dob: '',
      phone: '',
      gender: '',
      category: '',
      aadhaar: '',
      pan: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      agreeTerms: false
    };

    // Reset documents
    this.requiredDocuments = this.requiredDocuments.map(doc => ({ ...doc, uploaded: false }));

    if (this.applySchemeModalInstance) {
      this.applySchemeModalInstance.show();
    }
  }

  nextStep() {
    if (this.currentApplyStep < 3) {
      this.currentApplyStep++;
    }
  }

  previousStep() {
    if (this.currentApplyStep > 1) {
      this.currentApplyStep--;
    }
  }

  submitApplication() {
    // Simulate API call
    this.showSuccessAnimation = true;

    // Add chat message
    setTimeout(() => {
      this.streamAssistantMessage(`Your application for ${this.selectedScheme?.name || 'PMAY'} has been submitted successfully! Application ID: APP${Date.now().toString().slice(-6)}`);
    }, 1000);
  }

  closeApplyModal() {
    if (this.applySchemeModalInstance) {
      this.applySchemeModalInstance.hide();
    }
  }

  onDocumentUpload(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Simulate upload process
      setTimeout(() => {
        this.requiredDocuments[index].uploaded = true;
      }, 1000);
    }
  }

  viewSchemeDetails(scheme: any) {
    const query = `Tell me more about ${scheme.name}`;
    this.addUserMessage(query);

    this.isGeneratingResponse = true;

    // Simulate "thinking" time then stream
    setTimeout(() => {
      this.generateSchemeDetails(scheme);
    }, this.processingDelay);
  }

  toggleChatSize() {
    this.isShrink = !this.isShrink;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      this.isRightPanelOpen = false; // Close other panel
    }
  }

  toggleRightPanel() {
    this.isRightPanelOpen = !this.isRightPanelOpen;
    if (this.isRightPanelOpen) {
      this.isSidebarOpen = false; // Close other panel
    }
  }

  toggleLanguage() {
    const current = this.translationService.getCurrentLanguage();
    const next = current === 'en' ? 'mr' : 'en';
    this.translationService.setLanguage(next);
  }

  onQuickReply(key: string) {
    this.selectedQuick = key;
    const translatedText = this.translationService.translate(key);
    this.addUserMessage(translatedText);

    this.isGeneratingResponse = true;
    this.loadingAction = 'Processing...';

    // Simulate typing delay based on message complexity
    const delay = this.responseDelay;

    setTimeout(() => {
      const englishText = this.getEnglishTextForKey(key);
      this.generateRealisticSchemeResponse(englishText);
    }, delay);
  }

  private getEnglishTextForKey(key: string): string {
    // This is a helper to get English text for logic processing
    // Since our logic is based on English keywords
    const enMap: any = {
      'quickReply.eligible': 'What schemes am I eligible for?',
      'quickReply.housing': 'How to apply for housing subsidy?',
      'quickReply.agriculture': 'Show agriculture schemes',
      'quickReply.status': 'Check application status'
    };
    return enMap[key] || key;
  }

  sendMessage() {
    if (!this.message.trim() || this.isGeneratingResponse) return;

    this.addUserMessage(this.message.trim());
    const sent = this.message.trim();
    this.message = '';

    this.isGeneratingResponse = true;

    // Simulate typing delay based on message complexity
    const delay = this.shouldShowComplexResponse(sent) ? this.complexResponseDelay : this.responseDelay;

    setTimeout(() => {
      this.isGeneratingResponse = false;
      this.generateRealisticSchemeResponse(sent);
    }, delay);
  }

  addUserMessage(text: string) {
    this.messages.push({ from: 'user', text, time: this.getCurrentTime() });
    this.scrollBottom();
    // Auto-save after user sends message
    setTimeout(() => this.saveCurrentChat(), 500);
  }

  addAssistantMessage(text: string, isStructured: boolean = false, structuredData: any = null, isAccordion: boolean = false, accordionData: any = undefined) {
    // Legacy support or for instant messages
    this.messages.push({
      from: 'assistant',
      text,
      time: this.getCurrentTime(),
      isStructured,
      structuredData,
      isAccordion,
      accordionData
    });
    this.scrollBottom();
    // Auto-save after assistant responds
    setTimeout(() => this.saveCurrentChat(), 500);
  }

  // NEW: Stream assistant message for realistic effect
  async streamAssistantMessage(text: string, options: { isStructured?: boolean, structuredData?: any, isAccordion?: boolean, accordionData?: any } = {}) {
    this.isGeneratingResponse = false; // Stop loading indicator

    // Create initial empty message
    const message: ChatMessage = {
      from: 'assistant',
      text: '',
      time: this.getCurrentTime(),
      isStructured: false,
      structuredData: null,
      isAccordion: false,
      accordionData: undefined
    };

    this.messages.push(message);
    this.scrollBottom();

    const chars = text.split('');
    let i = 0;

    return new Promise<void>(resolve => {
      const interval = setInterval(() => {
        message.text += chars[i];
        i++;

        // Scroll every few chars to avoid jaggedness
        if (i % 3 === 0) this.scrollBottom();

        if (i >= chars.length) {
          clearInterval(interval);
          this.scrollBottom();

          // Reveal structured content after typing finishes
          if (options.isStructured) {
            message.isStructured = true;
            message.structuredData = options.structuredData;
          }
          if (options.isAccordion) {
            message.isAccordion = true;
            message.accordionData = options.accordionData;
            // Auto open the first scheme if it's an accordion
            if (options.accordionData?.schemes?.length > 0) {
              // message.accordionData.schemes[0].isExpanded = true;
            }
          }

          this.saveCurrentChat();
          resolve();
        }
      }, this.typingSpeed);
    });
  }

  // Helper method to determine response complexity
  private shouldShowComplexResponse(query: string): boolean {
    const complexKeywords = [
      'scheme', 'eligibility', 'apply', 'benefits', 'subsidy',
      'housing', 'agriculture', 'farmer', 'student', 'women',
      'details', 'information', 'show', 'list', 'find', 'check'
    ];

    return complexKeywords.some(keyword =>
      query.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Expert Modal Methods
  openTalkToExpertModal() {
    if (this.talkToExpertModalInstance) {
      this.talkToExpertModalInstance.show();
    }
  }

  startVoiceCall(expertName: string) {
    this.isConnectingCall = true;
    this.currentCallExpert = expertName;
    this.callConnected = false;
    this.callTimer = '00:00';
    this.isMuted = false;
    this.isSpeakerOn = false;

    // Close expert modal and open call modal
    if (this.talkToExpertModalInstance) {
      this.talkToExpertModalInstance.hide();
    }

    if (this.callModalInstance) {
      this.callModalInstance.show();
    }

    // Simulate call connection with loading
    setTimeout(() => {
      this.isConnectingCall = false;
      this.callConnected = true;
      this.callStartTime = new Date();
      this.startCallTimer();
    }, 3000); // 3 second connection delay
  }

  startVideoCall(expertName: string) {
    this.isStartingVideoCall = true;
    this.currentCallExpert = expertName;
    this.isVideoOn = true;
    this.isMuted = false;
    this.isSpeakerOn = false;
    this.videoCallTimer = '00:00';
    this.isVideoMinimized = false;

    // Close expert modal and open video call modal
    if (this.talkToExpertModalInstance) {
      this.talkToExpertModalInstance.hide();
    }

    if (this.videoCallModalInstance) {
      this.videoCallModalInstance.show();
    }

    // Start Webcam initialization immediately (permissions)
    this.initializeLocalStream();

    // Simulate video call connection with loading
    setTimeout(() => {
      this.isStartingVideoCall = false;
      this.videoCallStartTime = new Date();
      this.startVideoCallTimer();

      // IMPORTANT: Attach video stream only AFTER the view is rendered (loading overlay gone)
      // Small delay to ensure *ngIf change has processed and video tag exists
      setTimeout(() => {
        this.attachLocalStream();
      }, 100);

      // Add chat message
      this.addAssistantMessage(`Video call started with ${expertName}. You can now discuss your queries directly.`);
    }, 3000); // 3 second connection delay
  }

  startChat(expertName: string) {
    this.isLoading = true;
    this.loadingAction = 'Connecting to expert chat...';

    if (this.talkToExpertModalInstance) {
      this.talkToExpertModalInstance.hide();
    }

    this.addUserMessage(`I want to chat with ${expertName}`);

    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      this.addAssistantMessage(`I've connected you with ${expertName}. You can now chat directly with the expert.`);
    }, 2000);
  }

  scheduleCall(expertName: string) {
    this.isLoading = true;
    this.loadingAction = 'Opening schedule...';

    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      alert(`Scheduling a call with ${expertName}. In a real application, this would open a calendar/scheduling interface.`);
    }, 1500);
  }

  // Video Call Control Methods
  toggleVideoMinimize() {
    this.isVideoMinimized = !this.isVideoMinimized;
    // We need to handle the backdrop removal/addition if we want the user to interact with the background
    // For now, simpler implementation: just UI shrink
  }

  async toggleVideo() {
    this.isVideoOn = !this.isVideoOn;
    console.log(`Video ${this.isVideoOn ? 'enabled' : 'disabled'}`);

    if (!this.localStream) return;

    if (this.isVideoOn) {
      // Turning Video ON: request a new video track because the old one was stopped
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const newVideoTrack = videoStream.getVideoTracks()[0];

        if (newVideoTrack) {
          this.localStream.addTrack(newVideoTrack);
          // Refresh srcObject to ensure UI updates (sometimes needed)
          if (this.localVideo && this.localVideo.nativeElement) {
            this.localVideo.nativeElement.srcObject = this.localStream;
          }
        }
      } catch (error) {
        console.error('Error restarting video:', error);
        this.isVideoOn = false; // Revert UI if failed
        alert('Could not restart camera.');
      }
    } else {
      // Turning Video OFF: stop the track completely to turn off the hardware LED
      const videoTracks = this.localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.stop();
        this.localStream?.removeTrack(track); // Remove ended track
      });
    }
  }

  toggleMic() {
    this.isMuted = !this.isMuted;
    console.log(`Microphone ${this.isMuted ? 'muted' : 'unmuted'}`);

    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !this.isMuted;
      }
    }
  }

  // Alias method for toggleMute to match template
  toggleMute() {
    this.toggleMic();
  }

  toggleSpeaker() {
    this.isSpeakerOn = !this.isSpeakerOn;
    console.log(`Speaker ${this.isSpeakerOn ? 'enabled' : 'disabled'}`);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    // Here you would typically also update a global theme service or body class
    // For now, it just toggles the local state for the UI effect
  }

  toggleVoiceInput() {
    this.isVoiceInputActive = !this.isVoiceInputActive;

    if (this.isVoiceInputActive) {
      // Simulate listening
      setTimeout(() => {
        if (this.isVoiceInputActive) {
          // Simulate recognized text result after a few seconds
          this.message = "How can I apply for PM Kisan scheme?";
          this.isVoiceInputActive = false;
          // Focus back on input
          setTimeout(() => this.chatInput?.nativeElement?.focus(), 100);
        }
      }, 3000);
    }
  }

  endVideoCall() {
    this.stopVideoCallTimer();
    if (this.videoCallModalInstance) {
      this.videoCallModalInstance.hide();
    }

    this.addAssistantMessage(`Your video call with ${this.currentCallExpert} has ended. Duration: ${this.videoCallTimer}`);
    this.stopLocalVideo();
  }

  openChatDuringCall() {
    // In a real implementation, this would open a chat panel within the video call
    alert('Chat feature would open here during the video call');
  }

  private startVideoCallTimer() {
    this.videoCallInterval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - this.videoCallStartTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      this.videoCallTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  private stopVideoCallTimer() {
    if (this.videoCallInterval) {
      clearInterval(this.videoCallInterval);
      this.videoCallInterval = null;
    }
  }

  private async initializeLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera/microphone. Please ensure permissions are granted.');
      this.isVideoOn = false;
    }
  }

  private attachLocalStream() {
    if (this.localStream && this.localVideo && this.localVideo.nativeElement) {
      this.localVideo.nativeElement.srcObject = this.localStream;
      this.localVideo.nativeElement.muted = true; // Mute local video to prevent feedback
    } else {
      console.warn('Cannot attach video stream: Stream or Video Element missing');
    }
  }

  private stopLocalVideo() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    if (this.localVideo && this.localVideo.nativeElement) {
      this.localVideo.nativeElement.srcObject = null;
    }
  }

  // Call Control Methods
  endCall() {
    this.callConnected = false;
    this.stopCallTimer();
    if (this.callModalInstance) {
      this.callModalInstance.hide();
    }

    // Add message about ended call
    this.addAssistantMessage(`Your call with ${this.currentCallExpert} has ended. Duration: ${this.callTimer}`);
  }

  private startCallTimer() {
    this.callInterval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - this.callStartTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      this.callTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  private stopCallTimer() {
    if (this.callInterval) {
      clearInterval(this.callInterval);
      this.callInterval = null;
    }
  }

  // Timeline related methods
  getCompletedDocumentsCount(): number {
    return this.applicationProgress?.documents.filter(doc => doc.completed).length || 0;
  }

  // Timeline action methods
  downloadApplication() {
    this.isLoading = true;
    this.loadingAction = 'Generating application PDF...';

    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      this.streamAssistantMessage('I\'ve generated your PMAY Urban application PDF. You can download it from the documents section.');
      alert('Application PDF download started...');
    }, 2000);
  }

  uploadAdditionalDocs() {
    this.isLoading = true;
    this.loadingAction = 'Opening document upload...';

    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      this.streamAssistantMessage('You can upload additional documents for your PMAY application. Make sure they are clear and readable.');
      alert('Document upload interface would open here...');
    }, 1500);
  }

  checkVerificationStatus() {
    this.isLoading = true;
    this.loadingAction = 'Checking verification status...';

    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      this.streamAssistantMessage('Your document verification is 60% complete. The income certificate and address proof have been verified. Aadhaar verification is pending.');
    }, 2000);
  }

  rescheduleAppointment() {
    this.isLoading = true;
    this.loadingAction = 'Loading appointment calendar...';

    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      this.addAssistantMessage('I can help you reschedule your field inspection appointment. Please let me know your preferred date and time.');
      alert('Appointment rescheduling calendar would open here...');
    }, 1500);
  }

  viewAppointmentDetails() {
    const appointmentDetails = `
      Field Inspection Appointment Details:
      
      📅 Date: December 28, 2024
      ⏰ Time: 10:00 AM - 1:00 PM
      👤 Officer: Mr. Sharma (Field Inspector)
      📞 Contact: +91-9876543210
      📍 Address: Your registered property address
      
      Please keep all original documents ready for verification.
    `;

    this.addAssistantMessage(appointmentDetails);
  }

  viewSubsidyDetails() {
    const subsidyDetails = `
      PMAY Urban Subsidy Details:
      
      💰 Eligible Subsidy: ₹2.67 lakhs
      🏦 Credit Linked Subsidy: 6.5% interest
      📈 Loan Amount: ₹6 lakhs
      🗓️ Disbursement: Within 15 days of approval
      🏠 Property Type: Affordable Housing
      
      Your subsidy will be directly credited to your bank account.
    `;

    this.addAssistantMessage(subsidyDetails);
  }

  contactSupport() {
    this.isLoading = true;
    this.loadingAction = 'Connecting to support...';

    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      this.addAssistantMessage('I\'ve connected you with PMAY support. You can call them at 1800-11-6163 or email at pmay-urban@gov.in for immediate assistance.');
    }, 2000);
  }

  // Handle category clicks from Discover tab
  onCategoryClick(category: any) {
    this.loadingAction = 'Finding schemes...';

    const query = `Show me ${category.name} schemes`;
    this.addUserMessage(query);

    setTimeout(() => {
      this.generateCategoryResponse(category);
    }, this.processingDelay);
  }

  // Handle scheme clicks from Discover tab
  onSchemeClick(scheme: any) {
    this.loadingAction = 'Loading scheme details...';

    const query = `Tell me more about ${scheme.name}`;
    this.addUserMessage(query);

    setTimeout(() => {
      this.generateSchemeDetails(scheme);
    }, this.processingDelay);
  }

  // Handle eligibility result clicks
  onEligibilityResultClick(schemeName: string) {
    this.loadingAction = 'Analyzing eligibility...';

    const query = `Why am I ${schemeName === 'PMAY' ? '85%' : '50%'} eligible for ${schemeName}?`;
    this.addUserMessage(query);

    setTimeout(() => {
      this.generateEligibilityExplanation(schemeName);
    }, this.responseDelay);
  }

  // Handle update clicks
  onUpdateClick(update: any) {
    this.loadingAction = 'Loading update details...';

    const query = `Tell me more about: ${update.title}`;
    this.addUserMessage(query);

    setTimeout(() => {
      this.generateUpdateDetails(update);
    }, this.responseDelay);
  }

  // Handle quick link clicks
  onQuickLinkClick(link: any) {
    let query = '';

    switch (link.name) {
      case 'Saved Schemes':
        this.loadingAction = 'Loading saved schemes...';
        query = 'Show my saved schemes';
        break;
      case 'My Eligibility':
        this.loadingAction = 'Checking eligibility...';
        query = 'Check my eligibility for all schemes';
        this.activeTab = 'eligibility';
        break;
      case 'Calculator':
        this.loadingAction = 'Opening calculator...';
        query = 'Open subsidy calculator';
        break;
    }

    if (query) {
      this.addUserMessage(query);
      setTimeout(() => {
        this.generateQuickLinkResponse(link);
      }, this.responseDelay);
    }
  }

  generateCategoryResponse(category: any) {
    const response = `I found several government schemes for ${category.name}s. Here are the most relevant ones:`;

    const accordionResponse = {
      title: `Schemes for ${category.name}s`,
      description: `Here are government schemes specifically designed for ${category.name.toLowerCase()}:`,
      schemes: this.getSchemesByCategory(category.name)
    };

    this.streamAssistantMessage(
      response,
      { isAccordion: true, accordionData: accordionResponse }
    );
  }

  generateSchemeDetails(scheme: any) {
    const response = `Here are the complete details about ${scheme.name}:`;

    const accordionResponse = {
      title: scheme.name,
      description: scheme.description,
      schemes: [this.getDetailedSchemeData(scheme.name)]
    };

    this.streamAssistantMessage(
      response,
      { isAccordion: true, accordionData: accordionResponse }
    );
  }

  generateEligibilityExplanation(schemeName: string) {
    const percentage = schemeName === 'PMAY' ? '85%' : '50%';
    const explanation = schemeName === 'PMAY'
      ? 'You meet most eligibility criteria including income bracket, residential status, and documentation requirements. The main gap is in property ownership verification.'
      : 'You meet basic eligibility but need to provide additional agricultural land documentation and income verification for higher benefits.';

    this.streamAssistantMessage(
      `Your eligibility for ${schemeName} is ${percentage}. ${explanation} Would you like me to help you complete the missing requirements?`
    );
  }

  generateUpdateDetails(update: any) {
    const details = this.getUpdateDetails(update.title);
    this.streamAssistantMessage(
      `${update.title}\n\n${details}\n\nThis update was published ${update.date}. Would you like me to help you apply for any related schemes?`
    );
  }

  generateQuickLinkResponse(link: any) {
    let response = '';

    switch (link.name) {
      case 'Saved Schemes':
        response = 'Here are your saved schemes. You can click on any to view details or start application process.';
        break;
      case 'My Eligibility':
        response = 'Let me check your eligibility across all government schemes based on your profile...';
        break;
      case 'Calculator':
        response = 'Opening subsidy calculator. Please provide your basic details to calculate potential benefits.';
        break;
    }

    this.streamAssistantMessage(response);
  }

  // Helper methods for generating responses
  getSchemesByCategory(category: string) {
    const schemesMap: any = {
      'Farmer': [
        {
          id: 'pmkisan',
          name: 'PM Kisan Samman Nidhi',
          category: 'Agriculture',
          ministry: 'Agriculture & Farmers Welfare',
          isExpanded: false,
          sections: [{
            title: 'Benefits',
            content: '• ₹6,000 per year in 3 installments<br>• Direct bank transfer<br>• No middlemen involved'
          }],
          actions: [
            { label: 'Apply Now', icon: 'bi-check-circle', type: 'primary', color: 'green' },
            { label: 'Check Status', icon: 'bi-search', type: 'secondary', color: 'orange' },
            { label: 'Talk to Expert', icon: 'bi-headset', type: 'secondary', color: 'blue' },
            { label: 'Find Nearest CSC', icon: 'bi-geo-alt', type: 'secondary', color: 'teal' },
            { label: 'WhatsApp Share', icon: 'bi-whatsapp', type: 'secondary', color: 'whatsapp' }
          ]
        }
      ],
      'Student': [
        {
          id: 'scholarship',
          name: 'National Scholarship',
          category: 'Education',
          ministry: 'Education',
          isExpanded: false,
          sections: [{
            title: 'Benefits',
            content: '• Tuition fee coverage<br>• Maintenance allowance<br>• Book grants'
          }],
          actions: [
            { label: 'Apply Now', icon: 'bi-check-circle', type: 'primary', color: 'green' },
            { label: 'Talk to Expert', icon: 'bi-headset', type: 'secondary', color: 'blue' }
          ]
        }
      ]
    };

    return schemesMap[category] || [];
  }

  getDetailedSchemeData(schemeName: string) {
    const schemes: any = {
      'Pradhan Mantri Awas Yojana (PMAY)': {
        id: 'pmay-detailed',
        name: schemeName,
        category: 'Housing',
        ministry: 'Housing and Urban Affairs',
        isExpanded: true,
        sections: [
          {
            title: 'Complete Overview',
            content: 'Comprehensive housing scheme with multiple verticals including credit-linked subsidy, affordable housing partnerships, and beneficiary-led construction.'
          },
          {
            title: 'Eligibility Details',
            content: '• Annual Income: ₹3-18 lakhs<br>• Family Status: Must not own pucca house<br>• Women Ownership: Mandatory<br>• Location: Urban areas'
          }
        ],
        actions: [
          { label: 'Apply Now', icon: 'bi-check-circle', type: 'primary', color: 'green' },
          { label: 'Calculate Subsidy', icon: 'bi-calculator', type: 'secondary', color: 'blue' },
          { label: 'Talk to Expert', icon: 'bi-headset', type: 'secondary', color: 'purple' },
          { label: 'Find Nearest CSC', icon: 'bi-geo-alt', type: 'secondary', color: 'teal' },
          { label: 'WhatsApp Share', icon: 'bi-whatsapp', type: 'secondary', color: 'whatsapp' }
        ]
      }
    };

    return schemes[schemeName] || {};
  }

  getUpdateDetails(title: string) {
    const details: any = {
      'New PM Vishwakarma Scheme Launched': 'This scheme provides end-to-end support to traditional artisans and craftspersons through skill training, modern tool kits, and market linkage support. The scheme offers up to ₹2 lakh financial assistance.',
      'Digital Ration Card Rollout': 'The One Nation One Ration Card system now allows beneficiaries to access their food grain entitlements from any Fair Price Shop in the country using biometric authentication.',
      'PMAY Deadline Extended': 'The application deadline for PMAY Urban has been extended to March 2026 to accommodate more beneficiaries. Additional budget allocation of ₹20,000 crores has been approved.'
    };

    return details[title] || 'Detailed information about this update is being prepared.';
  }

  // NEW: Generate realistic scheme responses with intelligent query analysis
  generateRealisticSchemeResponse(query: string) {
    const queryLower = query.toLowerCase();
    let title = 'I found relevant government schemes for you';
    let description = 'Here are the schemes that match your query:';
    let schemes: any[] = [];

    // Analyze query and return ONLY relevant schemes
    if (queryLower.includes('housing') || queryLower.includes('home') || queryLower.includes('pmay') || queryLower.includes('awas')) {
      title = 'Housing & Construction Schemes';
      description = 'Here are government housing schemes for urban and rural areas:';
      schemes = this.getAllSchemesData().filter((s: any) =>
        s.category === 'Housing' || s.name.toLowerCase().includes('housing') || s.name.toLowerCase().includes('awas')
      );
    }
    else if (queryLower.includes('agriculture') || queryLower.includes('farmer') || queryLower.includes('kisan') || queryLower.includes('farm')) {
      title = 'Agriculture & Farmer Welfare Schemes';
      description = 'Here are schemes to support farmers and agriculture:';
      schemes = this.getAllSchemesData().filter((s: any) =>
        s.category === 'Agriculture' || s.name.toLowerCase().includes('kisan') || s.name.toLowerCase().includes('agriculture')
      );
    }
    else if (queryLower.includes('education') || queryLower.includes('student') || queryLower.includes('scholarship') || queryLower.includes('study')) {
      title = 'Education & Scholarship Schemes';
      description = 'Here are educational support and scholarship schemes:';
      schemes = this.getAllSchemesData().filter((s: any) =>
        s.category === 'Education' || s.name.toLowerCase().includes('education') || s.name.toLowerCase().includes('scholarship')
      );
    }
    else if (queryLower.includes('health') || queryLower.includes('medical') || queryLower.includes('ayushman') || queryLower.includes('insurance')) {
      title = 'Healthcare & Insurance Schemes';
      description = 'Here are health insurance and medical schemes:';
      schemes = this.getAllSchemesData().filter((s: any) =>
        s.category === 'Healthcare' || s.name.toLowerCase().includes('health') || s.name.toLowerCase().includes('ayushman')
      );
    }
    else if (queryLower.includes('women') || queryLower.includes('female') || queryLower.includes('ujjwala')) {
      title = 'Women Welfare Schemes';
      description = 'Here are schemes specifically for women empowerment:';
      schemes = this.getAllSchemesData().filter((s: any) =>
        s.category === 'Women Welfare' || s.name.toLowerCase().includes('women') || s.name.toLowerCase().includes('ujjwala')
      );
    }
    else if (queryLower.includes('senior') || queryLower.includes('pension') || queryLower.includes('old') || queryLower.includes('elderly')) {
      title = 'Senior Citizen & Pension Schemes';
      description = 'Here are pension and welfare schemes for senior citizens:';
      schemes = this.getAllSchemesData().filter((s: any) =>
        s.category === 'Pension' || s.name.toLowerCase().includes('pension') || s.name.toLowerCase().includes('atal')
      );
    }
    else if (queryLower.includes('skill') || queryLower.includes('training') || queryLower.includes('employment') || queryLower.includes('job')) {
      title = 'Skill Development & Employment Schemes';
      description = 'Here are skill training and employment schemes:';
      schemes = this.getAllSchemesData().filter((s: any) =>
        s.category === 'Education' || s.name.toLowerCase().includes('skill') || s.name.toLowerCase().includes('employment')
      );
    }
    else if (queryLower.includes('eligible') || queryLower.includes('all scheme') || queryLower.includes('what scheme')) {
      title = 'Government Schemes You May Be Eligible For';
      description = 'Based on your profile, here are schemes you might be eligible for:';
      // Return top 5 most popular schemes
      schemes = this.getAllSchemesData().slice(0, 5);
    }
    else {
      // Default: return top 3-4 most relevant schemes
      title = 'Popular Government Schemes';
      description = 'Here are some popular government schemes you might find useful:';
      schemes = this.getAllSchemesData().slice(0, 4);
    }

    // If no schemes found, provide helpful message
    if (schemes.length === 0) {
      this.streamAssistantMessage(
        `I couldn't find specific schemes matching "${query}". However, I can help you with:\n\n• Housing schemes (PMAY)\n• Agriculture schemes (PM Kisan)\n• Education schemes\n• Healthcare schemes (Ayushman Bharat)\n• Women welfare schemes\n\nWhat would you like to know more about?`
      );
      return;
    }

    const accordionResponse = {
      title: title,
      description: description,
      schemes: schemes
    };

    this.streamAssistantMessage(
      `I found ${schemes.length} ${schemes.length === 1 ? 'scheme' : 'schemes'} matching: "${query}"`,
      { isAccordion: true, accordionData: accordionResponse }
    );
  }

  // NEW: Get comprehensive scheme data with 5+ schemes
  getAllSchemesData() {
    return [
      {
        id: 'scheme1',
        name: 'Pradhan Mantri Awas Yojana (PMAY) - Urban',
        category: 'Housing',
        ministry: 'Ministry of Housing & Urban Affairs',
        isExpanded: false,
        sections: [
          {
            title: 'Scheme Overview',
            content: 'Provides affordable housing to urban poor with interest subsidy of 6.5% on home loans. Aimed at "Housing for All" by 2024.'
          },
          {
            title: 'Key Benefits',
            content: '• Interest subsidy: 6.5% for EWS/LIG<br>• Loan amount: Up to ₹25 lakhs<br>• Subsidy amount: Up to ₹2.67 lakhs<br>• Women ownership mandatory<br>• Additional ₹1.5 lakh for North-East states'
          },
          {
            title: 'Eligibility',
            content: '• Annual income: ₹3-18 lakhs<br>• No pucca house in name of any family member<br>• Family consists of husband, wife and unmarried children<br>• Beneficiary should not have availed central assistance under any housing scheme'
          }
        ],
        actions: [
          { label: 'Apply Now', icon: 'bi-check-circle', type: 'primary', color: 'green' },
          { label: 'Check Eligibility', icon: 'bi-clipboard-check', type: 'secondary', color: 'purple' },
          { label: 'Subsidy Calculator', icon: 'bi-calculator', type: 'secondary', color: 'blue' },
          { label: 'Talk to Expert', icon: 'bi-headset', type: 'secondary', color: 'orange' }
        ]
      },
      {
        id: 'scheme2',
        name: 'PM Kisan Samman Nidhi',
        category: 'Agriculture',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        isExpanded: false,
        sections: [
          {
            title: 'Scheme Overview',
            content: 'Income support scheme providing ₹6,000 per year to all landholding farmer families in three equal installments of ₹2,000 each.'
          },
          {
            title: 'Key Benefits',
            content: '• Direct benefit transfer to bank accounts<br>• No middlemen involved<br>• Financial assistance for purchasing seeds, fertilizers<br>• Covers all farmer families irrespective of landholding size'
          },
          {
            title: 'Eligibility',
            content: '• All landholding farmer families<br>• Small and marginal farmers (up to 2 hectares)<br>• Institutional landholders not eligible<br>• Farmer families holding constitutional posts not eligible'
          }
        ],
        actions: [
          { label: 'Check Status', icon: 'bi-search', type: 'primary', color: 'green' },
          { label: 'Register Now', icon: 'bi-person-plus', type: 'secondary', color: 'blue' },
          { label: 'Update Details', icon: 'bi-pencil', type: 'secondary', color: 'purple' },
          { label: 'Help & Support', icon: 'bi-question-circle', type: 'secondary', color: 'orange' }
        ]
      },
      {
        id: 'scheme3',
        name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
        category: 'Healthcare',
        ministry: 'Ministry of Health & Family Welfare',
        isExpanded: false,
        sections: [
          {
            title: 'Scheme Overview',
            content: 'World\'s largest health insurance scheme providing coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.'
          },
          {
            title: 'Key Benefits',
            content: '• Cashless treatment at empanelled hospitals<br>• Pre-existing diseases covered from day one<br>• No restrictions on family size, age or gender<br>• Covers 1,393 medical procedures'
          },
          {
            title: 'Eligibility',
            content: '• Based on SECC 2011 data (Deprivation criteria)<br>• Occupational categories of workers<br>• No income criteria for rural families<br>• For urban areas: 11 occupational categories'
          }
        ],
        actions: [
          {
            label: 'Guidance',
            icon: 'bi-lightbulb',
            type: 'secondary',
            color: 'orange'
          }
        ]
      },
      {
        id: 'scheme6',
        name: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
        category: 'Social Welfare',
        ministry: 'Ministry of Petroleum & Natural Gas',
        isExpanded: false,
        sections: [
          {
            title: 'Scheme Overview',
            content: 'Provides free LPG connections to women from Below Poverty Line (BPL) households to safeguard their health.'
          },
          {
            title: 'Key Benefits',
            content: '• Free LPG connection with security deposit<br>• First refill and stove cost included<br>• EMI facility for stove and first refill<br>• Subsidy on LPG cylinders'
          },
          {
            title: 'Eligibility',
            content: '• Adult woman from BPL household<br>• Must not already have an LPG connection<br>• Applicant must be 18 years or above<br>• Name should be in SECC-2011 list'
          }
        ],
        actions: [
          {
            label: 'Apply Now',
            icon: 'bi-fire',
            type: 'primary',
            color: 'green'
          },
          {
            label: 'Check Eligibility',
            icon: 'bi-clipboard-check',
            type: 'secondary',
            color: 'blue'
          },
          {
            label: 'Find Distributor',
            icon: 'bi-geo-alt',
            type: 'secondary',
            color: 'purple'
          },
          {
            label: 'Help Desk',
            icon: 'bi-headset',
            type: 'secondary',
            color: 'orange'
          }
        ]
      },
      {
        id: 'scheme7',
        name: 'Atal Pension Yojana (APY)',
        category: 'Pension',
        ministry: 'Ministry of Finance',
        isExpanded: false,
        sections: [
          {
            title: 'Scheme Overview',
            content: 'Pension scheme focused on unorganized sector workers providing guaranteed minimum pension of ₹1,000-₹5,000 per month after 60 years.'
          },
          {
            title: 'Key Benefits',
            content: '• Guaranteed pension: ₹1,000 to ₹5,000 per month<br>• Government co-contribution for eligible subscribers<br>• Flexible contribution periods<br>• Auto-debit facility from bank account'
          },
          {
            title: 'Eligibility',
            content: '• Any Indian citizen between 18-40 years<br>• Must have savings bank account<br>• Subscriber should not be income tax payer<br>• Should not be covered under any statutory social security scheme'
          }
        ],
        actions: [
          {
            label: 'Enroll Now',
            icon: 'bi-person-badge',
            type: 'primary',
            color: 'green'
          },
          {
            label: 'Pension Calculator',
            icon: 'bi-calculator',
            type: 'secondary',
            color: 'blue'
          },
          {
            label: 'Check Status',
            icon: 'bi-search',
            type: 'secondary',
            color: 'purple'
          },
          {
            label: 'Expert Advice',
            icon: 'bi-headset',
            type: 'secondary',
            color: 'orange'
          }
        ]
      }
    ];
  }

  toggleAccordion(schemeId: string) {
    const scheme = this.messages
      .flatMap(msg => msg.accordionData?.schemes || [])
      .find(s => s.id === schemeId);

    if (scheme) {
      scheme.isExpanded = !scheme.isExpanded;
    }
  }

  onActionClick(action: string, schemeName: string) {
    if (action === 'Talk to Expert') {
      this.openTalkToExpertModal();
    } else if (action === 'Apply Now') {
      this.openApplyModal({ name: schemeName });
    } else if (action === 'Find Nearest CSC') {
      this.findNearestCSC(schemeName);
    } else if (action === 'WhatsApp Share') {
      this.shareOnWhatsApp(schemeName);
    } else {
      console.log(`Action clicked: ${action} for scheme: ${schemeName}`);
      // Implement other action logic here
      alert(`Action: ${action} for ${schemeName}`);
    }
  }

  // New method to find nearest CSC
  findNearestCSC(schemeName: string) {
    this.isLoading = true;
    this.loadingAction = 'Finding nearby centers...';

    // In a real application, this would use geolocation API
    // and show nearby Common Service Centers
    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      alert(`Finding nearest Common Service Center for ${schemeName}...`);

      // You could also add a chat message
      this.addUserMessage(`Find nearest CSC for ${schemeName}`);

      setTimeout(() => {
        this.streamAssistantMessage(`I found 3 Common Service Centers near you that can help with ${schemeName} applications. The nearest one is 1.2km away at 123 Main Street.`);
      }, 1000);
    }, 2000);
  }

  // New method to share on WhatsApp
  shareOnWhatsApp(schemeName: string) {
    // In a real application, this would generate a WhatsApp share link
    const shareText = `Check out this government scheme: ${schemeName}. Found via JanSahay AI Assistant.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    // Open WhatsApp share in new window
    window.open(whatsappUrl, '_blank');

    // You could also add a chat message
    this.streamAssistantMessage(`I've prepared a WhatsApp message about ${schemeName}. You can share it with friends and family who might be interested!`);
  }

  // Eligibility methods
  checkEligibility() {
    this.isLoading = true;
    this.loadingAction = 'Checking eligibility...';

    // Simulate eligibility check
    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      this.showEligibilityResults = true;

      // Add user message
      this.addUserMessage('Check my eligibility for all schemes');

      // Simulate bot response
      setTimeout(() => {
        this.streamAssistantMessage('Based on your profile, I found 8 schemes you are eligible for. The top matches are PMAY (85%) and PM Kisan (50%).');
      }, 500);
    }, 2000);
  }

  onEligibilityFieldChange() {
    this.showEligibilityResults = false;
  }

  // Application methods
  viewApplicationDetails() {
    this.isLoading = true;
    this.loadingAction = 'Loading application details...';

    this.addUserMessage('Show my PMAY Urban application details');

    setTimeout(() => {
      this.isLoading = false;
      this.loadingAction = null;
      this.streamAssistantMessage('Your PMAY Urban application is 31% complete. Current status: Document verification pending. Next appointment: Dec 28, 2024.');
    }, 1500);
  }

  toggleDocumentCompletion(index: number) {
    if (this.applicationProgress && this.applicationProgress.documents[index]) {
      this.applicationProgress.documents[index].completed =
        !this.applicationProgress.documents[index].completed;
    }
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // placeholder functions
  attachFile() { console.log('attach'); }
  toggleNetwork() { console.log('network'); }

  scrollBottom() {
    setTimeout(() => {
      const el = document.querySelector('.chat-body');
      if (el) el.scrollTop = el.scrollHeight;
    }, 120);
  }

  // Chat History Methods
  private loadChatHistory() {
    this.chatHistory = this.chatHistoryService.getChatHistory();
  }

  startNewChat() {
    // Save current chat if it has messages
    if (this.messages.length > 0 && this.currentChatId) {
      this.saveCurrentChat();
    }

    // Reset for new chat
    this.messages = [];
    this.currentChatId = null;
    this.selectedQuick = null;
  }

  private saveCurrentChat() {
    if (this.messages.length === 0) return;

    const title = this.generateChatTitle();
    const lastMessage = this.messages[this.messages.length - 1].text;
    const messageCount = this.messages.length;

    if (this.currentChatId) {
      // Update existing chat
      this.chatHistoryService.updateChat(this.currentChatId, title, lastMessage, messageCount);
    } else {
      // Save new chat
      this.currentChatId = this.chatHistoryService.saveChat(title, lastMessage, messageCount);
    }

    // Reload history to update UI
    this.loadChatHistory();
  }

  private generateChatTitle(): string {
    // Try to extract scheme name or topic from messages
    const userMessages = this.messages.filter(m => m.from === 'user');
    if (userMessages.length === 0) return 'New Conversation';

    const firstMessage = userMessages[0].text.toLowerCase();

    // Check for scheme keywords
    if (firstMessage.includes('pmay') || firstMessage.includes('housing') || firstMessage.includes('awas')) {
      return this.translationService.translate('scheme.pmay');
    }
    if (firstMessage.includes('kisan') || firstMessage.includes('farmer') || firstMessage.includes('agriculture')) {
      return this.translationService.translate('scheme.pmKisan');
    }
    if (firstMessage.includes('ayushman') || firstMessage.includes('health')) {
      return this.translationService.translate('scheme.ayushman');
    }

    // Use first message (truncated)
    const title = userMessages[0].text.substring(0, 30);
    return title.length < userMessages[0].text.length ? title + '...' : title;
  }

  getRelativeTime(timestamp: Date): string {
    return this.chatHistoryService.getRelativeTime(timestamp);
  }

  clearChatHistory() {
    console.log('clearChatHistory called');
    console.log('Current chat history:', this.chatHistory);

    const confirmMessage = this.translationService.translate('chat.clearHistory') + '?';
    console.log('Confirm message:', confirmMessage);

    if (confirm(confirmMessage)) {
      console.log('User confirmed, clearing history...');
      this.chatHistoryService.clearHistory();
      this.loadChatHistory();
      console.log('History cleared. New history:', this.chatHistory);
    } else {
      console.log('User cancelled');
    }
  }

  onChatHistoryClick(chat: ChatHistoryEntry) {
    // Since we only store metadata (title, last message, count), not full message history,
    // we'll show info about the chat
    const message = `${chat.title}\n\n${this.translationService.translate('chat.lastMessage')}: ${chat.lastMessage}\n${this.translationService.translate('chat.messageCount')}: ${chat.messageCount}`;
    alert(message);

    // Alternatively, you could start a new chat about the same topic
    // this.startNewChat();
    // this.message = chat.title;
  }


}