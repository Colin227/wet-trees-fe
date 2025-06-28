import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService } from 'app/services/dashboard.service';
import { NgApexchartsModule, ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-watering-coverage',
  imports: [MatCardModule, NgApexchartsModule, MatProgressSpinnerModule],
  templateUrl: './watering-coverage.component.html',
  styleUrl: './watering-coverage.component.scss'
})
export class WateringCoverageComponent implements OnInit {
  chartOptions?: ApexOptions;

  constructor(private _dashboardService: DashboardService) { }

  ngOnInit(): void {
    this._dashboardService.getWateringCoverage().subscribe({
      next: ({ wateringCoverage }) => {
        this.chartOptions = {
          chart: { type: 'radialBar' },
          series: [wateringCoverage],
          labels: ['Zones Watered'],
          plotOptions: {
            radialBar: {
              hollow: {
                margin: 0,
                size: "70%",
                background: "#293450"
              },
              track: {
                background: "#1e2b3c",
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 0,
                  blur: 4,
                  opacity: 0.15
                }
              },
              dataLabels: {
                value: {
                  color: '#ffffff'
                }
              }
            },
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              type: "vertical",
              gradientToColors: ["#87f9e4"],
              stops: [0, 100]
            }
          },
          stroke: {
            lineCap: "round"
          },
        }
      }
    })

  }

}
