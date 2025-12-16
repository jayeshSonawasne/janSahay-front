import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  ApexGrid
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
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
};

// Stat Card Interface
interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  change: string;
  changeType: 'up' | 'down';
  color?: string;
  bgColor: string;
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
    MatInputModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Current date
  currentDate = Date.now();

  // Active Tab
  activeTab: any = 'dashboard';

  // Sidebar State
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
    { title: 'Pradhan Mantri Awas Yojana', category: 'Housing', funding: '₹2.5L', deadline: '31 Dec 2025', icon: 'bi-house-door', color: '#6366f1' },
    { title: 'Ayushman Bharat', category: 'Healthcare', funding: '₹5.0L', deadline: 'No Deadline', icon: 'bi-heart-pulse', color: '#ef4444' },
    { title: 'PM Kisan Samman Nidhi', category: 'Agriculture', funding: '₹6,000', deadline: 'Quarterly', icon: 'bi-flower1', color: '#10b981' },
    { title: 'Skill India Mission', category: 'Employment', funding: 'Training', deadline: 'Rolling', icon: 'bi-gear', color: '#f59e0b' },
    { title: 'Beti Bachao Beti Padhao', category: 'Social', funding: 'Scholarship', deadline: '31 Mar 2026', icon: 'bi-people', color: '#d946ef' },
    { title: 'Digital India', category: 'Technology', funding: 'Subsidies', deadline: 'Ongoing', icon: 'bi-laptop', color: '#3b82f6' }
  ];

  // Demo Data - Applications
  applicationsList = [
    { id: 'APP-2024-001', scheme: 'PM Awas Yojana', applicant: 'Rajesh Kumar', date: '12 Dec 2025', status: 'In Review', progress: 45 },
    { id: 'APP-2024-002', scheme: 'Ayushman Bharat', applicant: 'Anita Singh', date: '11 Dec 2025', status: 'Approved', progress: 100 },
    { id: 'APP-2024-003', scheme: 'Skill India', applicant: 'Vikram Malhotra', date: '10 Dec 2025', status: 'Pending', progress: 10 },
    { id: 'APP-2024-004', scheme: 'PM Kisan', applicant: 'Suresh Patil', date: '09 Dec 2025', status: 'Rejected', progress: 100 },
    { id: 'APP-2024-005', scheme: 'Digital India', applicant: 'Meera Reddy', date: '08 Dec 2025', status: 'In Review', progress: 60 }
  ];

  // Demo Data - Reports
  reportsList = [
    { name: 'Annual Scheme Performance 2024', type: 'PDF', size: '2.4 MB', date: '10 Dec 2025' },
    { name: 'Beneficiary Distribution Data', type: 'Excel', size: '1.8 MB', date: '08 Dec 2025' },
    { name: 'Q3 Financial Utilization', type: 'PDF', size: '3.1 MB', date: '01 Dec 2025' },
    { name: 'State-wise Analysis', type: 'CSV', size: '450 KB', date: '28 Nov 2025' }
  ];

  // Demo Data - Messages
  messagesList = [
    { sender: 'System Admin', subject: 'System Maintenance Alert', summary: 'Scheduled downtime on Sunday...', time: '10:30 AM', unread: true, avatar: 'S' },
    { sender: 'District Officer', subject: 'Application APP-002 Approved', summary: 'Please verify the documents for...', time: 'Yesterday', unread: false, avatar: 'D' },
    { sender: 'Support Team', subject: 'Ticket #4582 Resolved', summary: 'Your query regarding scheme list...', time: '08 Dec', unread: false, avatar: 'S' }
  ];

  // Stat Cards Data
  statCards: StatCard[] = [
    {
      title: 'Total Applications',
      value: '12,543',
      change: '+12.5%',
      changeType: 'up',
      icon: 'bi-file-earmark-text',
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Active Schemes',
      value: '45',
      change: '+5',
      changeType: 'up',
      icon: 'bi-clipboard-check',
      bgColor: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)'
    },
    {
      title: 'Beneficiaries',
      value: '8,234',
      change: '+18.2%',
      changeType: 'up',
      icon: 'bi-people',
      bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)'
    },
    {
      title: 'Success Rate',
      value: '87.5%',
      change: '+2.3%',
      changeType: 'up',
      icon: 'bi-trophy',
      bgColor: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)'
    }
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

  constructor() { }

  ngOnInit(): void {
    this.initializeTableData();
    this.initializeCharts();
  }

  initializeTableData(): void {
    this.topSchemesDataSource = new MatTableDataSource(this.topSchemes);
    setTimeout(() => {
      this.topSchemesDataSource.paginator = this.paginator;
      this.topSchemesDataSource.sort = this.sort;
    });
  }

  initializeCharts(): void {
    this.initApplicationTrendsChart();
    this.initSchemePerformanceChart();
    this.initTargetVsAchievementChart();
    this.initStateDistributionChart();
  }

  initApplicationTrendsChart(): void {
    this.applicationTrendsChart = {
      series: [
        {
          name: 'Applications',
          data: [420, 532, 516, 575, 648, 698, 755, 812, 891, 945, 1024, 1156]
        }
      ],
      chart: {
        type: 'area',
        height: 300,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif'
      },
      colors: ['#6366f1'],
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '12px'
          }
        }
      },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (val) => val + ' applications'
        }
      }
    };
  }

  initSchemePerformanceChart(): void {
    this.schemePerformanceChart = {
      series: [{
        name: 'Performance Score',
        data: [92, 88, 95, 86, 90, 87, 93]
      }],
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false }
      },
      colors: ['#10b981'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: '60%',
          distributed: false
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Housing', 'Healthcare', 'Agriculture', 'Energy', 'Sanitation', 'Education', 'Employment'],
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '11px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#94a3b8'
          }
        }
      },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4
      }
    };
  }

  initTargetVsAchievementChart(): void {
    this.targetVsAchievementChart = {
      series: [
        {
          name: 'Target',
          data: [800, 900, 850, 950, 1000, 1100, 1050, 1150, 1200, 1250, 1300, 1400]
        },
        {
          name: 'Achievement',
          data: [755, 812, 891, 945, 1024, 1156, 1089, 1198, 1245, 1289, 1356, 1423]
        }
      ],
      chart: {
        type: 'bar',
        height: 300,
        toolbar: { show: false }
      },
      colors: ['#f59e0b', '#6366f1'],
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '70%'
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '11px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#94a3b8'
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4
      }
    };
  }

  initStateDistributionChart(): void {
    this.stateDistributionChart = {
      series: [{
        name: 'Applications',
        data: [2543, 2156, 1987, 1765, 1543, 1432, 1234, 1098, 987, 876]
      }],
      chart: {
        type: 'bar',
        height: 500,
        toolbar: { show: false }
      },
      colors: ['#8b5cf6'],
      plotOptions: {
        bar: {
          borderRadius: 8,
          horizontal: true,
          barHeight: '70%'
        }
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Maharashtra', 'UP', 'Bihar', 'WB', 'MP', 'TN', 'Rajasthan', 'Karnataka', 'Gujarat', 'AP'],
        labels: {
          style: {
            colors: '#94a3b8'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '11px'
          }
        }
      },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 4
      }
    };
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'active': 'status-active',
      'pending': 'status-pending',
      'completed': 'status-completed',
      'approved': 'status-approved',
      'rejected': 'status-rejected'
    };
    return statusClasses[status] || '';
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.topSchemesDataSource.filter = filterValue.trim().toLowerCase();
  }

  setActiveTab(tab: 'dashboard' | 'applications' | 'schemes' | 'analytics' | 'reports' | 'messages' | 'settings'): void {
    this.activeTab = tab;
  }
}
