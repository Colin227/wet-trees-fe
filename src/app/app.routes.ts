import { Routes } from '@angular/router';
import { TreesComponent } from './components/trees/trees.component';
import { HomeComponent } from './components/home/home.component';
import { SitesComponent } from './components/sites/sites.component';
import { WateringsComponent } from './components/waterings/waterings.component';
import { DevicesComponent } from './components/devices/devices.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'trees',
        canActivate: [authGuard],
        loadComponent: () => import('./components/trees/trees.component').then(m => m.TreesComponent)
    },
    {
        path: 'sites',
        canActivate: [authGuard],
        loadComponent: () => import('./components/sites/sites.component').then(m => m.SitesComponent)
    },
    {
        path: 'waterings',
        canActivate: [authGuard],
        loadComponent: () => import('./components/waterings/waterings.component').then(m => m.WateringsComponent)
    },
    {
        path: 'devices',
        canActivate: [authGuard], // TODO: Admin role only
        loadComponent: () => import('./components/devices/devices.component').then(m => m.DevicesComponent)
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    }
];
