import { Component, inject, Input, OnInit } from '@angular/core';
import { NavBarItem } from '../../models/navBarItem';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgStyle } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [DividerModule, NgStyle],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  @Input({ required: true }) navBarItems: NavBarItem[] = [];

  ngOnInit(): void {
    this.assignColors();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.assignColors();
      });
  }

  private assignColors(): void {
    this.navBarItems.forEach((item) => {
      item.color = null;

      var plainRoute = '/' + this.getUrlWithoutParams(this.activatedRoute.root);

      if (
        plainRoute == '/' + item.route ||
        item.alternativeRoutes.some((route) => plainRoute == '/' + route)
      ) {
        item.color = 'var(--p-primary-800)';
      }
    });
  }

  private getUrlWithoutParams(route: ActivatedRoute): string {
    var urlSegments = [route.firstChild];

    let i = 0;
    while (urlSegments[i]!.children.length > 0) {
      urlSegments.push(urlSegments[i]!.firstChild);
      i++;
    }

    var urlParts = urlSegments.map((urlPart) => urlPart?.snapshot.url[0].path!);

    return urlParts.join('/');
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
