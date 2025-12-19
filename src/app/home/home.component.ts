import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = false;
  private scrollObserver!: IntersectionObserver;

  // UI State
  activeTab: 'home' | 'schemes' | 'guide' | 'benefits' | 'team' | 'contact' = 'home';
  isDarkMode = true; // Default to dark mode for premium feel

  // Guide Animation State
  guideStepsVisible: boolean[] = [false, false, false, false];

  // Stats Animation State
  statsAnimated = false;

  // Team Members Data
  // Team Members Data
  teamMembers = [
    {
      name: 'Ravindra Salunkhe',
      role: 'Team Owner & Lead',
      workInfo: 'Driving project vision and strategic partnerships for JanSahay.',
      expertise: ['Project Leadership', 'Strategic Planning', 'Management'],
      image: 'assets/images/Ravindra_Salunkhe.png',
      isLead: true,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Amar Gaikwad',
      role: 'Team Owner & Lead',
      workInfo: 'Crafting intuitive user experiences and defining product roadmap.',
      expertise: ['UI/UX Design', 'Product Strategy', 'Creative Direction'],
      image: 'assets/images/Amar_Gaikwad.png',
      isLead: true,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Uddhav Bade',
      role: 'Sr. Mobile Application Developer',
      workInfo: 'Developing cross-platform solutions with native-like performance.',
      expertise: ['Native Development', 'Cross-Platform', 'API Integration'],
      image: 'assets/images/Uddhav_Bade.png',
      isLead: false,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Kiran Mane',
      role: 'Sr. Mobile Application Developer',
      workInfo: 'Building robust mobile architectures for seamless performance.',
      expertise: ['Mobile Architecture', 'Performance Optimization', 'App Security'],
      image: 'assets/images/Kiran_Mane.png',
      isLead: false,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Jayesh Sonawane',
      role: 'Software Developer',
      workInfo: 'Implementing scalable backend services and frontend logic.',
      expertise: ['Full Stack Development', 'Angular', 'Node.js'],
      image: 'assets/images/Jayesh_Sonawane.png',
      isLead: false,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Shrutika Mapari',
      role: 'Software Developer',
      workInfo: ' creating responsive and interactive web interfaces.',
      expertise: ['Frontend Developer', 'Angular', 'Node.js'],
      image: 'assets/images/Shrutika_Mapari.png',
      isLead: false,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Siddhesh Gophane',
      role: 'UI Developer',
      workInfo: 'Designing pixel-perfect UIs with engaging animations.',
      expertise: ['Responsive Design', 'HTML5/SCSS', 'Animations'],
      image: 'assets/images/Siddhesh_Gophane.png',
      isLead: false,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Tejas Phalke',
      role: 'Jr. Data Analyst',
      workInfo: 'Analyzing user data to derive actionable insights.',
      expertise: ['Requirement Analysis', 'Agile Methodology', 'Documentation'],
      image: 'assets/images/Tejas_Phalake.png',
      isLead: false,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Ajinkya Mali',
      role: 'Jr. AI/ML Engineer',
      workInfo: 'Developing AI models for personalized scheme recommendations.',
      expertise: ['Machine Learning', 'NLP', 'Data Science'],
      image: 'assets/images/Ajinkya_Mali.png',
      isLead: false,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    },
    {
      name: 'Saurabh Khedkar',
      role: 'Quality Assurance Engineer',
      workInfo: 'Ensuring bug-free delivery through rigorous automated testing.',
      expertise: ['Automation Testing', 'Quality Control', 'Bug Tracking'],
      image: 'assets/images/Saurabh_Khedkar.png',
      isLead: false,
      social: { linkedin: '#', twitter: '#', instagram: '#', facebook: '#' }
    }
  ];

  // Testimonials Data
  testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Small Business Owner',
      company: 'Kumar Enterprises',
      image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=667eea&color=fff&size=128',
      rating: 5,
      text: 'JanSahay has transformed how we access government schemes. The AI chatbot is incredibly helpful and the dashboard makes tracking applications so easy!',
      plan: 'Professional'
    },
    {
      name: 'Priya Sharma',
      role: 'NGO Director',
      company: 'Rural Development Foundation',
      image: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=11998e&color=fff&size=128',
      rating: 5,
      text: 'We serve hundreds of beneficiaries monthly. The Enterprise plan with custom workflows has been a game-changer for our organization.',
      plan: 'Enterprise'
    },
    {
      name: 'Amit Patel',
      role: 'Freelance Consultant',
      company: 'Independent',
      image: 'https://ui-avatars.com/api/?name=Amit+Patel&background=f093fb&color=fff&size=128',
      rating: 5,
      text: 'The Basic plan is perfect for my needs. Great value for money and excellent customer support. Highly recommended!',
      plan: 'Basic'
    }
  ];

  // Data for Schemes Tab
  schemes = [
    {
      title: 'Pradhan Mantri Awas Yojana',
      category: 'Housing',
      description: 'Affordable housing scheme for urban and rural poor.',
      icon: 'bi-house-heart',
      color: 'primary'
    },
    {
      title: 'PM Kisan Samman Nidhi',
      category: 'Agriculture',
      description: 'Income support for all landholding farmer families.',
      icon: 'bi-flower1',
      color: 'success'
    },
    {
      title: 'Ayushman Bharat',
      category: 'Health',
      description: 'Health insurance coverage of 5 lakhs per family.',
      icon: 'bi-heart-pulse',
      color: 'danger'
    },
    {
      title: 'Skill India Mission',
      category: 'Education',
      description: 'Skill development training for youth employment.',
      icon: 'bi-mortarboard',
      color: 'warning'
    },
    {
      title: 'Digital India',
      category: 'Technology',
      description: 'Empowering citizens with digital infrastructure.',
      icon: 'bi-laptop',
      color: 'info'
    },
    {
      title: 'Start-up India',
      category: 'Business',
      description: 'Fostering entrepreneurship and innovation.',
      icon: 'bi-rocket-takeoff',
      color: 'secondary'
    }
  ];

  // Data for Guide Tab
  guideSteps = [
    {
      title: 'Check Eligibility',
      desc: 'Answer a few simple questions to find schemes you qualify for.',
      icon: 'bi-check-circle'
    },
    {
      title: 'Prepare Documents',
      desc: 'Get a personalized checklist of required documents.',
      icon: 'bi-file-earmark-text'
    },
    {
      title: 'Apply Online',
      desc: 'Submit your application directly through our secure portal.',
      icon: 'bi-laptop'
    },
    {
      title: 'Track Status',
      desc: 'Get real-time updates on your application progress.',
      icon: 'bi-bell'
    }
  ];

  // Data for Benefits Tab
  benefits = [
    {
      title: 'Direct Benefit Transfer',
      desc: 'Subsidy transferred directly to your bank account.',
      icon: 'bi-cash-coin'
    },
    {
      title: 'Paperless Process',
      desc: 'Completely digital workflow with no physical paperwork.',
      icon: 'bi-file-earmark-x'
    },
    {
      title: 'Expert Assistance',
      desc: '24/7 AI support and access to scheme experts.',
      icon: 'bi-headset'
    },
    {
      title: 'Secure & Private',
      desc: 'Your data is encrypted and protected at all times.',
      icon: 'bi-shield-lock'
    }
  ];

  constructor(private router: Router, private spinner: NgxSpinnerService) { }

  // Computed property for visible steps count
  get visibleStepsCount(): number {
    return this.guideStepsVisible.filter(v => v).length;
  }

  ngOnInit() {
    // Initialize scroll animations
    this.initScrollAnimations();

    // Add scroll listener for navbar
    window.addEventListener('scroll', this.onScroll.bind(this));

    // Initialize guide animations if guide tab is active
    setTimeout(() => {
      if (this.activeTab === 'guide') {
        this.animateGuideSteps();
      }
    }, 300);

    // Initialize stats animations if home tab is active
    setTimeout(() => {
      if (this.activeTab === 'home') {
        this.statsAnimated = true;
      }
    }, 500);
  }

  ngOnDestroy() {
    // Clean up event listeners
    window.removeEventListener('scroll', this.onScroll.bind(this));

    // Disconnect observer
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  }

  setActiveTab(tab: 'home' | 'schemes' | 'guide' | 'benefits' | 'team' | 'contact') {
    this.activeTab = tab;

    // Reset guide animations when switching to guide tab
    if (tab === 'guide') {
      this.resetGuideAnimations();
      // Start animations after a small delay
      setTimeout(() => {
        this.animateGuideSteps();
      }, 300);
    }

    // Trigger stats animations when switching to home tab
    if (tab === 'home' && !this.statsAnimated) {
      setTimeout(() => {
        this.statsAnimated = true;
      }, 500);
    }

    // Re-initialize animations when switching tabs
    setTimeout(() => this.initScrollAnimations(), 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  goToChatbox() {
    this.isLoading = true;
    this.spinner.show();

    // Simulate loading and navigate
    setTimeout(() => {
      this.router.navigate(['/login']);
      this.spinner.hide();
      this.isLoading = false;
    }, 1500);
  }

  goToDashboard() {
    this.isLoading = true;
    this.spinner.show('dashboardSpinner');

    // Simulate loading and navigate to dashboard
    setTimeout(() => {
      this.router.navigate(['/secure/dashboard']);
      this.spinner.hide('dashboardSpinner');
      this.isLoading = false;
    }, 1500);
  }

  @HostListener('window:scroll')
  onScroll() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Fallback scroll animation check for older browsers
    if (!('IntersectionObserver' in window)) {
      this.fallbackScrollCheck();
    }
  }

  // Guide Animation Methods
  private resetGuideAnimations() {
    this.guideStepsVisible = [false, false, false, false];
  }

  private animateGuideSteps() {
    if (this.activeTab !== 'guide') return;

    // Animate each step with a staggered delay
    this.guideStepsVisible.forEach((_, index) => {
      setTimeout(() => {
        if (this.activeTab === 'guide') {
          this.guideStepsVisible[index] = true;
        }
      }, index * 500); // 500ms delay between each step
    });
  }

  private initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      this.setupFallbackAnimations();
    }
  }

  private setupIntersectionObserver() {
    // Create Intersection Observer with staggered animation support
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class to trigger animation
          entry.target.classList.add('visible');

          // Stop observing once animated (for performance)
          this.scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: '0px 0px -100px 0px' // Trigger 100px before element enters viewport
    });

    // Observe all fade-in cards
    const fadeInCards = document.querySelectorAll('.fade-in-card');
    fadeInCards.forEach(card => {
      this.scrollObserver.observe(card);
    });

    // Observe CTA section
    const ctaCard = document.querySelector('.cta-card');
    if (ctaCard) {
      this.scrollObserver.observe(ctaCard);
    }
  }

  private setupFallbackAnimations() {
    // Fallback for browsers without IntersectionObserver
    // Listen for scroll and trigger animations manually
    window.addEventListener('scroll', () => {
      this.fallbackScrollCheck();
    });

    // Initial check
    setTimeout(() => {
      this.fallbackScrollCheck();
    }, 100);
  }

  private fallbackScrollCheck() {
    const fadeInCards = document.querySelectorAll('.fade-in-card');
    const ctaCard = document.querySelector('.cta-card');
    const windowHeight = window.innerHeight;

    // Check each card
    fadeInCards.forEach(card => {
      const cardRect = card.getBoundingClientRect();
      const isVisible = cardRect.top < windowHeight * 0.85;

      if (isVisible && !card.classList.contains('visible')) {
        card.classList.add('visible');
      }
    });

    // Check CTA card
    if (ctaCard) {
      const ctaRect = ctaCard.getBoundingClientRect();
      const isVisible = ctaRect.top < windowHeight * 0.85;

      if (isVisible && !ctaCard.classList.contains('visible')) {
        ctaCard.classList.add('visible');
      }
    }
  }
}

