import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faFile, faHome, faPhone, faSchoolCircleCheck, faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { BrowserService } from '../../services/browser/browser';


export interface MenuItem {
  label: string;
  link: string;
  icon: IconDefinition;
  color?: string;
}


@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements AfterViewInit {
  isSticky = false;
  menuItems: MenuItem[] = [
    { label: 'Inicio', link: '#hero', icon: faHome },
    { label: 'Acerca de mi', link: '#about', icon: faUser, color: '#FCD7B6' },
    { label: 'Trayectoria', link: '#experience', icon: faFile, color: '#4CAF50' },
    { label: 'Habilidades', link: '#skills', icon: faStar, color: '#FFD700' },
    { label: 'Formación academica', link: '#education', icon: faSchoolCircleCheck, color: '#00bcff' },
    { label: 'Contactame', link: '#contact', icon: faPhone, color: '#F44336' }
  ];

  constructor(private browser: BrowserService) {}

  ngAfterViewInit(): void {
    if (this.browser.isBrowser()) {
      const sentinel = document.getElementById('hero');
      if (sentinel && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            this.isSticky = !entry.isIntersecting;
          },
          {
            root: null,
            threshold: 0,
          }
        );
        observer.observe(sentinel);
      }
    }
  }
}
