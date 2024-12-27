import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-manager-header',
  standalone: true,
  imports: [MenuModule, ButtonModule],
  templateUrl: './manager-header.component.html',
  styleUrl: './manager-header.component.scss',
})
export class ManagerHeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);

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
        ],
      },
    ];
  }
}
