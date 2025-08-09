import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngular, faFlutter } from '@fortawesome/free-brands-svg-icons';

/**
 *
 */
@Component({
  imports: [FontAwesomeModule],
  selector: 'app-hero',
  styleUrl: './hero.css',
  templateUrl: './hero.html',
})
export class Hero {
  faAngular = faAngular;
  faFlutter = faFlutter;
}
