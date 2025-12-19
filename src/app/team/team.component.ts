import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input() isDarkMode = true;

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

  ngOnInit(): void {
    // Add fade-in animation logic if standalone
    setTimeout(() => {
      const cards = document.querySelectorAll('.fade-in-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 100);
      });
    }, 100);
  }
}
