import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Site } from '@models';
import { SitesService } from 'app/services/sites.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-sites',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss'
})
export class SitesComponent implements OnInit {
    private sitesService = inject(SitesService);

  private _sites$ = new BehaviorSubject<Site[]>([]);

  sites$ = this._sites$.asObservable();

  private _loadSites() {
    this.sitesService.getAllSites().subscribe({
      next: (sites: Site[]) => {
        console.log('Sites loaded:', sites);
        this._sites$.next(sites);
      },
      error: (err) => {
        console.error('Error loading sites:', err);
      }
    });
  }
  
  // Lifecycle hook to load sites when the component is initialized   
  ngOnInit() {
    this._loadSites();
  }

}
