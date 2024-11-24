import { Component, inject, Input } from '@angular/core';
import { NavBarItem } from '../../models/navBarItem';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [DividerModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  router = inject(Router);

  @Input({ required: true }) navBarItems: NavBarItem[] = [];
}
