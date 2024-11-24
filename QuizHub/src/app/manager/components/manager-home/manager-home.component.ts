import { Component } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ManagerHeaderComponent } from '../manager-header/manager-header.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { NavBarItem } from '../../models/navBarItem';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manager-home',
  standalone: true,
  imports: [
    PanelMenuModule,
    ManagerHeaderComponent,
    NavBarComponent,
    RouterOutlet,
  ],
  templateUrl: './manager-home.component.html',
  styleUrl: './manager-home.component.scss',
})
export class ManagerHomeComponent {
  navBarItems: NavBarItem[] = [
    {
      text: 'Strona główna',
      icon: 'pi pi-home',
      route: 'manager/main',
    },
    {
      text: 'Bazy Pytań',
      icon: 'pi pi-question-circle',
      route: 'manager/question-bases',
    },
    {
      text: 'Kreator testów',
      icon: 'pi pi-wrench',
      route: '',
    },
    {
      text: 'Historia testów',
      icon: 'pi pi-address-book',
      route: '',
    },
  ];
}
