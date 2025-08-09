import { Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Navbar } from "../../shared/components/navbar/navbar";
import { About } from "./sections/about/about";
import { Contact } from "./sections/contact/contact";
import { Education } from "./sections/education/education";
import { Experience } from "./sections/experience/experience";
import { Hero } from './sections/hero/hero';
import { Skills } from "./sections/skills/skills";

@Component({
  selector: 'app-landing',
  imports: [
    Hero,
    About,
    Skills,
    Experience,
    Contact,
    Education,
    FontAwesomeModule,
    Navbar
],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {
  faArrowUp = faArrowUp;
  showScrollTop = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.showScrollTop = scrollY > window.innerHeight * 0.8;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
