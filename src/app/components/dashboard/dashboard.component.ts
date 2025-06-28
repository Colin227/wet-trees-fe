import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'app/services/dashboard.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardStats } from '@models';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatProgressSpinnerModule, NgApexchartsModule, DatePipe]
})
export class DashboardComponent implements OnInit {
  stats?: DashboardStats;
  chartOptions?: ApexOptions;
  currentDate = new Date();

  constructor(private dashboardService: DashboardService) {

  }

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(data => {

      this.stats = data;
      this.chartOptions = {
        chart: { type: 'donut', background: "#2f2f2f" },
        labels: ['Healthy', 'Needs Attention'],
        series: [data.totalTrees, data.treesNeedingAttention],
        colors: ['#66bb6a', '#ef5350'],
        dataLabels: {
          enabled: false
        },
        legend: {
          labels: {
            colors: "#ffffff",
          },
        },
      };
    });
  }

  // private _initPieChart = (stats: DashboardStats) => {

  // }
}
