import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { SchemeDetailsComponent } from './scheme-details/scheme-details.component';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
  ApexTooltip,
  ApexGrid,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  title?: ApexTitleSubtitle;
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  grid?: ApexGrid;
  colors?: string[];
  labels?: string[];
};

// ... Interfaces remain the same ...
// Stat Card Interface
interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  change: string;
  changeType: 'up' | 'down';
  description: string;
  iconColor: string;
  iconBg: string;
}

// Top Scheme Interface
interface TopScheme {
  rank: number;
  name: string;
  category: string;
  applications: number;
  successRate: number;
  budget: string;
  status: 'active' | 'pending' | 'completed';
}

// Recent Activity Interface
interface RecentActivity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
  type: 'application' | 'system' | 'alert' | 'user';
}

// Quick Action Interface
interface QuickAction {
  title: string;
  icon: string;
  color: string;
  bgCallback: string;
  action?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    SchemeDetailsComponent,
    ApplicationDetailsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public demographicPyramidChart!: Partial<ChartOptions>;
  public fundingHeatmapChart!: Partial<ChartOptions>;

  currentDate = Date.now();
  activeTab: any = 'dashboard';
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  // Demo Data - Schemes
  schemesList = [
    { title: 'Pradhan Mantri Awas Yojana', category: 'Housing', funding: '₹2.5L', deadline: '31 Dec 2025', icon: 'bi-house-door', color: '#3b82f6', description: 'Financial assistance for affordable housing.' },
    { title: 'Ayushman Bharat', category: 'Healthcare', funding: '₹5.0L', deadline: 'No Deadline', icon: 'bi-heart-pulse', color: '#ef4444', description: 'Health insurance coverage for low-income families.' },
    { title: 'PM Kisan Samman Nidhi', category: 'Agriculture', funding: '₹6,000', deadline: 'Quarterly', icon: 'bi-flower1', color: '#10b981', description: 'Income support for small and marginal farmers.' },
    { title: 'Skill India Mission', category: 'Employment', funding: 'Training', deadline: 'Rolling', icon: 'bi-gear', color: '#f59e0b', description: 'Vocational training to enhance employability.' },
    { title: 'Beti Bachao Beti Padhao', category: 'Social', funding: 'Scholarship', deadline: '31 Mar 2026', icon: 'bi-people', color: '#d946ef', description: 'Campaign to generate awareness and improve welfare services for girls.' },
    { title: 'Digital India', category: 'Technology', funding: 'Subsidies', deadline: 'Ongoing', icon: 'bi-laptop', color: '#8b5cf6', description: 'Empowering India digitally with high-speed internet.' },
    { title: 'Startup India', category: 'Business', funding: 'Tax Benefits', deadline: '30 Jun 2025', icon: 'bi-rocket-takeoff', color: '#ec4899', description: 'Promoting entrepreneurship and innovation.' },
    { title: 'Swachh Bharat', category: 'Sanitation', funding: 'Infrastructure', deadline: 'Ongoing', icon: 'bi-trash', color: '#06b6d4', description: 'National campaign for clean streets and roads.' }
  ];

  // Demo Data - Applications (Expanded)
  applicationsList = [
    { id: 'APP-2024-001', scheme: 'PM Awas Yojana', applicant: 'Rajesh Kumar', date: '12 Dec 2025', status: 'In Review', progress: 45, type: 'Housing' },
    { id: 'APP-2024-002', scheme: 'Ayushman Bharat', applicant: 'Anita Singh', date: '11 Dec 2025', status: 'Approved', progress: 100, type: 'Healthcare' },
    { id: 'APP-2024-003', scheme: 'Skill India', applicant: 'Vikram Malhotra', date: '10 Dec 2025', status: 'Pending', progress: 10, type: 'Employment' },
    { id: 'APP-2024-004', scheme: 'PM Kisan', applicant: 'Suresh Patil', date: '09 Dec 2025', status: 'Rejected', progress: 100, type: 'Agriculture' },
    { id: 'APP-2024-005', scheme: 'Digital India', applicant: 'Meera Reddy', date: '08 Dec 2025', status: 'In Review', progress: 60, type: 'Technology' },
    { id: 'APP-2024-006', scheme: 'Beti Bachao', applicant: 'Priya Sharma', date: '07 Dec 2025', status: 'Approved', progress: 100, type: 'Social' },
    { id: 'APP-2024-007', scheme: 'Startup India', applicant: 'Rahul Verma', date: '05 Dec 2025', status: 'Correction Needed', progress: 30, type: 'Business' },
    { id: 'APP-2024-008', scheme: 'Swachh Bharat', applicant: 'Gram Panchayat', date: '02 Dec 2025', status: 'In Review', progress: 75, type: 'Sanitation' }
  ];

  applicationsDataSource = new MatTableDataSource(this.applicationsList);
  applicationsColumns: string[] = ['id', 'applicant', 'scheme', 'date', 'status', 'progress', 'action'];

  // Demo Data - Reports
  reportsList = [
    { name: 'Annual Scheme Performance 2024', type: 'PDF', size: '2.4 MB', date: '10 Dec 2025', description: 'Comprehensive analysis of all schemes.' },
    { name: 'Beneficiary Distribution Data', type: 'Excel', size: '1.8 MB', date: '08 Dec 2025', description: 'Raw data of beneficiaries by district.' },
    { name: 'Q3 Financial Utilization', type: 'PDF', size: '3.1 MB', date: '01 Dec 2025', description: 'Financial audit report for Q3.' },
    { name: 'State-wise Analysis', type: 'CSV', size: '450 KB', date: '28 Nov 2025', description: 'Comparative analysis of state performance.' },
    { name: 'Impact Assessment Report', type: 'PDF', size: '5.2 MB', date: '15 Nov 2025', description: 'Third-party impact assessment results.' }
  ];

  // Demo Data - Messages
  messagesList = [
    { id: 1, sender: 'System Admin', subject: 'System Maintenance Alert', summary: 'Scheduled downtime on Sunday from 2 AM to 4 AM for server upgrades.', time: '10:30 AM', unread: true, avatar: 'S', color: '#ef4444' },
    { id: 2, sender: 'District Officer', subject: 'Application APP-002 Approved', summary: 'Please verify the documents for Anita Singh before final disbursement.', time: 'Yesterday', unread: false, avatar: 'D', color: '#3b82f6' },
    { id: 3, sender: 'Support Team', subject: 'Ticket #4582 Resolved', summary: 'Your query regarding the scheme list not loading has been resolved.', time: '08 Dec', unread: false, avatar: 'S', color: '#10b981' },
    { id: 4, sender: 'Rahul Verma', subject: 'Clarification on Startup Scheme', summary: 'I need some help understanding the tax benefit clause.', time: '05 Dec', unread: true, avatar: 'R', color: '#f59e0b' },
    { id: 5, sender: 'Priya Sharma', subject: 'Document Resubmission', summary: 'I have uploaded the corrected Aadhar card copy.', time: '03 Dec', unread: false, avatar: 'P', color: '#8b5cf6' }
  ];

  selectedMessage: any = null;

  // Recent Activity Data
  recentActivities: RecentActivity[] = [
    { id: 1, title: 'New Application Submitted', description: 'Rajesh Kumar applied for PM Awas Yojana', time: '2 mins ago', icon: 'bi-file-earmark-plus', color: '#3b82f6', type: 'application' },
    { id: 2, title: 'Scheme Updated', description: 'Ayushman Bharat funding limit increased', time: '1 hour ago', icon: 'bi-arrow-up-circle', color: '#10b981', type: 'system' },
    { id: 3, title: 'User Verification Pending', description: '5 new users waiting for approval', time: '3 hours ago', icon: 'bi-person-badge', color: '#f59e0b', type: 'user' },
    { id: 4, title: 'System Alert', description: 'Server maintenance scheduled for tonight', time: '5 hours ago', icon: 'bi-exclamation-triangle', color: '#ef4444', type: 'alert' },
    { id: 5, title: 'Report Generated', description: 'Monthly performance report is ready', time: '1 day ago', icon: 'bi-file-earmark-bar-graph', color: '#8b5cf6', type: 'system' }
  ];

  // Quick Actions Data
  quickActions: QuickAction[] = [
    { title: 'New Application', icon: 'bi-plus-lg', color: '#3b82f6', bgCallback: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Verify User', icon: 'bi-person-check', color: '#10b981', bgCallback: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Gen. Report', icon: 'bi-file-earmark-arrow-down', color: '#f59e0b', bgCallback: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Bulk Upload', icon: 'bi-cloud-upload', color: '#8b5cf6', bgCallback: 'rgba(139, 92, 246, 0.1)' }
  ];

  // Stat Cards Data
  statCards: StatCard[] = [
    { title: 'Total Applications', value: '12,543', change: '+12.5%', changeType: 'up', description: 'vs. last month', icon: 'bi-file-earmark-text', iconColor: '#3b82f6', iconBg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Active Schemes', value: '45', change: '+5', changeType: 'up', description: 'Newly added', icon: 'bi-clipboard-check', iconColor: '#10b981', iconBg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Beneficiaries', value: '8,234', change: '+18.2%', changeType: 'up', description: 'Total impacted', icon: 'bi-people', iconColor: '#f59e0b', iconBg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Success Rate', value: '87.5%', change: '+2.3%', changeType: 'up', description: 'Approval rate', icon: 'bi-trophy', iconColor: '#8b5cf6', iconBg: 'rgba(139, 92, 246, 0.1)' }
  ];

  // Top Schemes Table Data
  topSchemes: TopScheme[] = [
    { rank: 1, name: 'Pradhan Mantri Awas Yojana', category: 'Housing', applications: 2543, successRate: 92.5, budget: '₹25.4 Cr', status: 'active' },
    { rank: 2, name: 'Ayushman Bharat', category: 'Healthcare', applications: 1876, successRate: 88.3, budget: '₹18.2 Cr', status: 'active' },
    { rank: 3, name: 'PM Kisan Samman Nidhi', category: 'Agriculture', applications: 1654, successRate: 95.1, budget: '₹16.5 Cr', status: 'active' },
    { rank: 4, name: 'Ujjwala Yojana', category: 'Energy', applications: 1432, successRate: 85.7, budget: '₹14.3 Cr', status: 'active' },
    { rank: 5, name: 'Swachh Bharat Mission', category: 'Sanitation', applications: 1234, successRate: 90.2, budget: '₹12.3 Cr', status: 'active' }
  ];

  topSchemesDataSource!: MatTableDataSource<TopScheme>;
  displayedColumns: string[] = ['rank', 'name', 'category', 'applications', 'successRate', 'budget', 'status'];

  // Chart Options
  public applicationTrendsChart!: Partial<ChartOptions>;
  public schemePerformanceChart!: Partial<ChartOptions>;
  public targetVsAchievementChart!: Partial<ChartOptions>;
  public stateDistributionChart!: Partial<ChartOptions>;
  public userDemographicsChart!: Partial<ChartOptions>;

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initializeTableData();
    this.initializeCharts();
  }

  // Interactivity Methods
  viewSchemeDetails(scheme: any) {
    const dialogRef = this.dialog.open(SchemeDetailsComponent, {
      width: '800px',
      maxWidth: '95vw',
      panelClass: 'scheme-details-dialog',
      data: scheme
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'apply') {
        this.applyForScheme(scheme);
      }
    });
  }

  applyForScheme(scheme: any) {
    this.snackBar.open(`Application process started for ${scheme.title}`, 'OK', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  downloadReport(report: any) {
    this.snackBar.open(`Downloading ${report.name}...`, 'Cancel', { duration: 2000 });
  }

  viewApplication(app: any) {
    this.dialog.open(ApplicationDetailsComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: app
    });
  }

  selectMessage(msg: any) {
    this.selectedMessage = msg;
    msg.unread = false;
  }

  performQuickAction(action: any) {
    this.snackBar.open(`Action initiated: ${action.title}`, 'Close', { duration: 2000 });
  }

  initializeTableData(): void {
    this.topSchemesDataSource = new MatTableDataSource(this.topSchemes);
    setTimeout(() => {
      this.topSchemesDataSource.paginator = this.paginator;
      this.topSchemesDataSource.sort = this.sort;
      this.applicationsDataSource.paginator = this.paginator;
    });
  }

  initializeCharts(): void {

    // 1. Application Trends - High Density Data (Mock Daily Data)
    this.applicationTrendsChart = {
      series: [
        {
          name: 'Applications',
          // Generating 30 days of random trending data
          data: Array.from({ length: 30 }, (_, i) => Math.floor(Math.random() * (120 - 50 + 1) + 50) + (i * 2))
        }
      ],
      chart: {
        type: 'area',
        height: 350,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
        animations: { enabled: true }
      },
      colors: ['#3b82f6'],
      stroke: { curve: 'smooth', width: 3 }, // Fixed width type
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        // Generating dates for the last 30 days
        categories: Array.from({ length: 30 }, (_, i) => `${i + 1} Nov`),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: true, style: { colors: '#94a3b8', fontSize: '10px' }, rotate: -45 }
      },
      yaxis: { labels: { style: { colors: '#94a3b8' } } },
      grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
      tooltip: { theme: 'light' }
    };

    // 2. Scheme Performance - Multi-Color Bar
    this.schemePerformanceChart = {
      series: [{
        name: 'Performance',
        data: [92, 88, 95, 86, 90, 87, 93, 85, 89, 91] // More data points
      }],
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1', '#14b8a6', '#f97316'],
      plotOptions: {
        bar: { borderRadius: 6, columnWidth: '60%', distributed: true }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Housing', 'Health', 'Agri', 'Edu', 'Jobs', 'Infra', 'Tech', 'Rural', 'Women', 'Child'],
        labels: { style: { colors: '#94a3b8', fontSize: '11px' } }
      },
      grid: { show: false }
    };

    // 3. Target vs Achievement - High Density
    this.targetVsAchievementChart = {
      series: [
        { name: 'Target', data: [100, 120, 110, 130, 140, 150, 160, 170, 165, 180, 190, 200, 210, 220, 230] },
        { name: 'Achieved', data: [90, 110, 105, 125, 130, 145, 155, 160, 162, 175, 185, 195, 205, 215, 225] }
      ],
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#e2e8f0', '#3b82f6'],
      plotOptions: { bar: { borderRadius: 2, columnWidth: '70%' } },
      dataLabels: { enabled: false },
      xaxis: { labels: { show: false } }, // Compact view
      yaxis: { show: false },
      grid: { show: false },
      legend: { position: 'top', horizontalAlign: 'right' }
    };

    // 4. State Distribution
    this.stateDistributionChart = {
      series: [{
        name: 'Applications',
        data: [2543, 2156, 1987, 1765, 1543, 1432, 1234, 1098, 987, 876, 765, 654]
      }],
      chart: {
        type: 'bar',
        height: 450,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#8b5cf6'],
      plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: '70%' } },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Maha', 'UP', 'Bihar', 'WB', 'MP', 'TN', 'Raj', 'Kar', 'Guj', 'AP', 'Tel', 'Ker'] },
      grid: { borderColor: '#f1f5f9' }
    };

    // 5. User Demographics
    this.userDemographicsChart = {
      series: [35, 40, 15, 7, 3],
      chart: { type: 'donut', height: 350, fontFamily: 'Inter, sans-serif' },
      labels: ['18-25', '26-35', '36-45', '46-60', '60+'],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
      legend: { position: 'bottom' },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: { show: true, label: 'Total', fontSize: '16px', color: '#64748b' }
            }
          }
        }
      }
    };

    // 6. Demographic Pyramid (Advanced)
    this.demographicPyramidChart = {
      series: [
        { name: 'Male', data: [4, 5, 6, 7, 5, 4, 3] },
        { name: 'Female', data: [-4, -5, -6, -7, -5, -4, -3] }
      ],
      chart: { type: 'bar', height: 350, stacked: true, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      colors: ['#3b82f6', '#ec4899'],
      plotOptions: { bar: { horizontal: true, barHeight: '80%' } },
      dataLabels: { enabled: false },
      stroke: { width: 1, colors: ['#fff'] },
      grid: { xaxis: { lines: { show: false } } },
      yaxis: { min: -10, max: 10, title: { text: 'Age Groups' } },
      tooltip: {
        shared: false,
        x: { formatter: (val: any) => val },
        y: { formatter: (val: any) => Math.abs(val) + "%" }
      },
      xaxis: {
        categories: ['80+', '70-79', '60-69', '50-59', '40-49', '30-39', '20-29'],
        labels: { formatter: (val: string) => Math.abs(Math.round(parseInt(val, 10))) + "%" }
      }
    };

    // 7. Funding Heatmap (Advanced)
    this.fundingHeatmapChart = {
      series: [
        { name: 'Jan', data: this.generateData(12, { min: 0, max: 90 }) },
        { name: 'Feb', data: this.generateData(12, { min: 0, max: 90 }) },
        { name: 'Mar', data: this.generateData(12, { min: 0, max: 90 }) },
        { name: 'Apr', data: this.generateData(12, { min: 0, max: 90 }) },
        { name: 'May', data: this.generateData(12, { min: 0, max: 90 }) },
        { name: 'Jun', data: this.generateData(12, { min: 0, max: 90 }) },
        { name: 'Jul', data: this.generateData(12, { min: 0, max: 90 }) },
        { name: 'Aug', data: this.generateData(12, { min: 0, max: 90 }) },
        { name: 'Sep', data: this.generateData(12, { min: 0, max: 90 }) }
      ],
      chart: { type: 'heatmap', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      dataLabels: { enabled: false },
      colors: ['#3b82f6'],
      xaxis: { categories: ['Maha', 'UP', 'Bihar', 'WB', 'MP', 'TN', 'Raj', 'Kar', 'Guj', 'AP', 'Tel', 'Ker'] }
    };
  }

  generateData(count: number, yrange: { min: number, max: number }) {
    let i = 0;
    const series = [];
    while (i < count) {
      const x = 'w' + (i + 1).toString();
      const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      series.push({ x: x, y: y });
      i++;
    }
    return series;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'active': 'status-active',
      'pending': 'status-pending',
      'completed': 'status-completed',
      'approved': 'status-approved',
      'rejected': 'status-rejected',
      'in review': 'status-pending',
      'correction needed': 'status-pending'
    };
    return statusClasses[status.toLowerCase()] || '';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.topSchemesDataSource.filter = filterValue.trim().toLowerCase();
  }

  setActiveTab(tab: 'dashboard' | 'applications' | 'schemes' | 'analytics' | 'reports' | 'messages' | 'settings'): void {
    this.activeTab = tab;
  }
}
