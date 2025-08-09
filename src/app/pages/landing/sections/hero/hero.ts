import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngular, faFlutter } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-hero',
  imports: [
    FontAwesomeModule,
  ],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class Hero {
  faAngular = faAngular;
  faFlutter = faFlutter;
}
