import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faFile,
  faHome,
  faPhone,
  faSchoolCircleCheck,
  faStar,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import { BrowserService } from '../../services/browser/browser';

export interface MenuItem {
  color?: string;
  icon: IconDefinition;
  label: string;
  link: string;
}

/**
 *
 */
@Component({
  imports: [CommonModule, FontAwesomeModule],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements AfterViewInit {
  isSticky = false;
  menuItems: MenuItem[] = [
    { icon: faHome, label: 'Inicio', link: '#hero' },
    { color: '#FCD7B6', icon: faUser, label: 'Acerca de mi', link: '#about' },
    {
      color: '#4CAF50',
      icon: faFile,
      label: 'Trayectoria',
      link: '#experience',
    },
    { color: '#FFD700', icon: faStar, label: 'Habilidades', link: '#skills' },
    {
      color: '#00bcff',
      icon: faSchoolCircleCheck,
      label: 'Formación academica',
      link: '#education',
    },
    { color: '#F44336', icon: faPhone, label: 'Contactame', link: '#contact' },
  ];

  private _browser = inject(BrowserService);

  ngAfterViewInit(): void {
    if (this._browser.isBrowser()) {
      const sentinel = document.getElementById('hero');
      if (sentinel && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            this.isSticky = !entry.isIntersecting;
          },
          {
            root: null,
            threshold: 0,
          },
        );
        observer.observe(sentinel);
      }
    }
  }
}
