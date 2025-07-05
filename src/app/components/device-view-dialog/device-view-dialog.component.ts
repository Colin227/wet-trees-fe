import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Device, EnvironmentReading } from '@models';
import { EnvironmentReadingsService } from 'app/services/environment-readings.service';
import { ApexAxisChartSeries, ApexChart, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, NgApexchartsModule } from 'ng-apexcharts';
import { BehaviorSubject } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  colors: string[];
  grid: ApexGrid;
  markers: ApexMarkers
};


@Component({
  selector: 'app-device-view-dialog',
  imports: [MatDialogModule, AsyncPipe, JsonPipe, MatButtonModule, NgApexchartsModule],
  templateUrl: './device-view-dialog.component.html',
  styleUrl: './device-view-dialog.component.scss'
})
export class DeviceViewDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DeviceViewDialogComponent>);
  readonly device = inject<Device>(MAT_DIALOG_DATA);
  private _environmentReadingsService = inject(EnvironmentReadingsService);

  private _readings$ = new BehaviorSubject<EnvironmentReading[]>([]);
  public readings$ = this._readings$.asObservable();

  public chartOptions: Partial<ChartOptions> | null = null;

  ngOnInit(): void {
    this._environmentReadingsService.getReadingsByDeviceId(this.device.deviceId).subscribe({
      next: (readings) => {
        this._readings$.next(readings);
        const series = [
          {
            name: 'Temperature (°C)',
            data: readings.map(r => ({ x: new Date(r.recordedAt), y: r.temperature }))
          },
          {
            name: 'Humidity (%)',
            data: readings.map(r => ({ x: new Date(r.recordedAt), y: r.humidity }))
          },
          {
            name: 'Moisture',
            data: readings.map(r => ({ x: new Date(r.recordedAt), y: r.moisture }))
          }
        ];

        this.chartOptions = {
          chart: {
            type: 'line',
            height: 350,
            zoom: { enabled: true },
            toolbar: { show: false },
            background: 'transparent',
            foreColor: '#ccc', // text color
          },
          stroke: {
            curve: 'smooth',
            width: 2
          },
          colors: ['#ff7043', '#66bb6a', '#42a5f5'], // temp (orange), humidity (green), moisture (blue)
          series,
          xaxis: {
            type: 'datetime',
            title: {
              text: 'Date',
              style: { color: '#ccc' }
            },
            labels: {
              style: { colors: '#ccc' },
              datetimeUTC: false,
            }
          },
          yaxis: {
            title: {
              text: 'Sensor Values',
              style: { color: '#ccc' }
            },
            labels: {
              style: { colors: '#ccc' }
            }
          },
          tooltip: {
            theme: 'dark',
            x: { format: 'dd MMM yyyy HH:mm:ss' }
          },
          legend: {
            position: 'top',
            labels: {
              colors: '#ccc'
            }
          },
          grid: {
            borderColor: '#444'
          }
        };
      },
      error: (err: any) => {
        console.error("Error getting readings by device ID. ", err);
      }
    })
  }
}
