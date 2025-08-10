import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faFile,
  faHome,
  faPhone,
  faSchoolCircleCheck,
  faStar,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import { ScrollScaleDirective } from '../../directives/scroll/scroll-scale.directive';
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
  imports: [CommonModule, FontAwesomeModule, ScrollScaleDirective],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar implements AfterViewInit, OnInit {
  currentUrl = '';
  faBars = faBars;
  faXmark = faXmark;
  isSticky = false;
  @ViewChild('menuBtn', { read: ElementRef }) menuBtn!: ElementRef<HTMLElement>;
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

  open = false;

  originX = 0;
  originY = 0;

  private _browser = inject(BrowserService);
  private _router = inject(Router);

  /**
   * Cierra el menú al presionar la tecla ESC.
   */
  @HostListener('document:keydown.escape')
  closeOnEsc() {
    this.open = false;
  }

  ngAfterViewInit(): void {
    if (this._browser.isBrowser()) {
      const sentinel = document.getElementById('menu');
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

  ngOnInit() {
    this._router.events.subscribe(() => {
      const urlArray = window.location.href.split('#');
      this.currentUrl = `#${urlArray[urlArray.length - 1]}`;
    });
  }

  /**
   * Alterna el estado del menú.
   * @param {boolean} visible - Si se debe mostrar el menú.
   */
  toggleMenu(visible?: boolean): void {
    const btn = this.menuBtn.nativeElement.getBoundingClientRect();
    // centro del botón (origen de la animación)
    this.originX = btn.left + btn.width / 2;
    this.originY = btn.top + btn.height / 2; // corrige scroll
    this.open = visible ?? !this.open;
    if (this.open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
}
