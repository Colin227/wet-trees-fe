import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink, MatDividerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _router = inject(Router);

  isAuthenticated() {
    return this._authService.isAuthenticated();
  }

  getEmail(): string {
    return this._userService.getEmail();
  }

  getFirstName(): string {
    return this._userService.getFirstName();
  }

  getLastName(): string {
    return this._userService.getLastName();
  }

  logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

}
