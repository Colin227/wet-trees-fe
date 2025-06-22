import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Site, Zone } from '@models';
import { SitesService } from 'app/services/sites.service';
import { BehaviorSubject } from 'rxjs';
import { SiteFormComponent } from '../site-form/site-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ZoneFormComponent } from '../zone-form/zone-form.component';
import { ZonesService } from 'app/services/zones.service';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-sites',
  imports: [AsyncPipe, JsonPipe, MatButtonModule, MatIconModule, MatTableModule, DatePipe, MatSortModule],
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss'
})
export class SitesComponent implements OnInit {
  private siteService = inject(SitesService);
  private _zonesService = inject(ZonesService); // Assuming ZonesService is used for zones

  private _sites$ = new BehaviorSubject<Site[]>([]);

  readonly dialog = inject(MatDialog);

  sites$ = this._sites$.asObservable();

  dataSource = new MatTableDataSource<Partial<Site>>();

  displayedColumns: string[] = ['id', 'name', 'location', 'actions'];

  displayedColumnsWithExpand: string[] = [...this.displayedColumns];

  expandedElement: Site | null = null;

  @ViewChild(MatTable) table!: MatTable<Site>;
  @ViewChild(MatSort) sort!: MatSort;

  /** Checks whether an element is expanded. */
  isExpanded(element: Site) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: Site) {
    console.log('Toggling element:', element);
    this.expandedElement = this.isExpanded(element) ? null : element;

  }

  private _loadSites() {
    this.siteService.getAllSites().subscribe({
      next: (sites: Site[]) => {
        console.log('Sites loaded:', sites);
        this.dataSource.data = sites; // Update the data source for the table
        this.dataSource.sort = this.sort; // Set the sort for the table
        this.table.renderRows(); // Refresh the table view
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


  createSite() {
    console.log('Create site button clicked');
    const dialogRef = this.dialog.open(SiteFormComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Site created:', result);
        this._loadSites(); // Reload sites after creation
      } else {
        console.log('Site creation cancelled');
      }
    });
  }

  editSite(site: Site) {
    console.log('Edit site button clicked for site:', site);
    const dialogRef = this.dialog.open(SiteFormComponent, {
      data: site
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Site updated:', result);
        this._loadSites(); // Reload sites after update
      } else {
        console.log('Site update cancelled');
      }
    });
  }

  deleteSite(site: Site) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Site',
        message: `Are you sure you want to delete the site with ID ${site.id}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Site deleted:', site);
        this.siteService.deleteSite(site.id).subscribe({
          next: () => {
            console.log('Tree deleted successfully'); // TODO: Show success message
            this._loadSites(); // Reload sites after deletion
          },
          error: (err) => {
            console.error('Error deleting site:', err); // TODO: Show error message
          }
        });
      }
    });
  }

  createZone(site: Site) {
    console.log('Create zone button clicked for site:', site);
    const dialogRef = this.dialog.open(ZoneFormComponent, {
      data: { site: site }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Zone created:', result);
        this._loadSites(); // Reload sites after creation
      } else {
        console.log('Zone creation cancelled');
      }
    });
  }


  editZone(zone: Zone, site: Site) {
    console.log('Edit zone button clicked for zone:', zone);
    const dialogRef = this.dialog.open(ZoneFormComponent, {
      data: {
        id: zone.id,
        name: zone.name,
        site: site // Pass the site to the dialog
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Zone edited:', result);
        this._loadSites(); // Reload sites after creation
      } else {
        console.log('Zone edit cancelled');
      }
    });
  }

  deleteZone(zone: Zone) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Zone',
        message: `Are you sure you want to delete the zone with ID ${zone.id}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Zone deleted:', zone);
        this._zonesService.deleteZone(zone.id).subscribe({
          next: () => {
            console.log('Zone deleted successfully'); // TODO: Show success message
            this._loadSites(); // Reload sites after deletion
          },
          error: (err) => {
            console.error('Error deleting zone:', err); // TODO: Show error message
          }
        });
      }
    })
  }




}
