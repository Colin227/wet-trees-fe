import { Routes } from '@angular/router';
import { TreesComponent } from './components/trees/trees.component';
import { HomeComponent } from './components/home/home.component';
import { SitesComponent } from './components/sites/sites.component';
import { WateringsComponent } from './components/waterings/waterings.component';
import { DevicesComponent } from './components/devices/devices.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'trees',
        component: TreesComponent
    },
    {
        path: 'sites',
        component: SitesComponent
    },
    {
        path: 'waterings',
        component: WateringsComponent
    },
    {
        path: 'devices',
        component: DevicesComponent
    }
];
