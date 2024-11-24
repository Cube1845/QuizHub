import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-manager-header',
  standalone: true,
  imports: [MenuModule, ButtonModule],
  templateUrl: './manager-header.component.html',
  styleUrl: './manager-header.component.scss',
})
export class ManagerHeaderComponent implements OnInit {
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
          },
        ],
      },
    ];
  }
}
