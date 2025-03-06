import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-header',
  standalone: true,
  imports: [MenuModule, ButtonModule],
  templateUrl: './manager-header.component.html',
  styleUrl: './manager-header.component.scss',
})
export class ManagerHeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Konto',
        iconClass: 'text-color-icon',
        items: [
          {
            label: 'Wyloguj się',
            icon: 'pi pi-sign-out',
            command: () => this.authService.signOut(),
          },
          {
            label: 'Zmień hasło',
            icon: 'pi pi-wrench',
            command: () => this.router.navigateByUrl('manager/change-password'),
          },
        ],
      },
    ];
  }
}
