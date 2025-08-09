import { Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

import { Navbar } from '../../shared/components/navbar/navbar';
import { About } from './sections/about/about';
import { Contact } from './sections/contact/contact';
import { Education } from './sections/education/education';
import { Experience } from './sections/experience/experience';
import { Hero } from './sections/hero/hero';
import { Skills } from './sections/skills/skills';

/**
 * Componente de la página de inicio
 */
@Component({
  imports: [
    Hero,
    About,
    Skills,
    Experience,
    Contact,
    Education,
    FontAwesomeModule,
    Navbar,
  ],
  selector: 'app-landing',
  styleUrl: './landing.css',
  templateUrl: './landing.html',
})
export class Landing {
  faArrowUp = faArrowUp;
  showScrollTop = false;

  /**
   * Detecta el scroll y muestra el botón de volver arriba
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.showScrollTop = scrollY > window.innerHeight * 0.8;
  }

  /**
   * Desplaza la ventana al inicio de la página con animación suave
   */
  scrollToTop(): void {
    window.scrollTo({ behavior: 'smooth', top: 0 });
  }
}
