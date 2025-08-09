import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface Skill {
  name: string;
  src: string;
}

@Component({
  selector: 'app-skills',
  imports: [
    CommonModule
  ],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class Skills {
  skills : Record<string, Skill[]> = {
    frontend : [
    { name: 'Angular', src: 'logos/skills/angular.svg' },
    { name: 'Flutter', src: 'logos/skills/flutter.svg' },
  ],

  backend : [
    { name: 'Node.js', src: 'logos/skills/nodejs.svg' },
    { name: 'NestJS', src: 'logos/skills/nestjs.svg' },
    { name: '.NET core', src: 'logos/skills/dotnet.svg' },
  ],


  languages : [
    { name: 'TypeScript', src: 'logos/skills/typescript.svg' },
    { name: 'JavaScript', src: 'logos/skills/javascript.svg' },
    { name: 'HTML', src: 'logos/skills/html.svg' },
    { name: 'CSS', src: 'logos/skills/css.svg' },
    { name: 'Dart', src: 'logos/skills/dart.svg' },
    { name: 'C#', src: 'logos/skills/csharp.svg' },
  ],


  libraries : [
    { name: 'RxJS', src: 'logos/skills/rxjs.svg' },
    { name: 'Tailwind', src: 'logos/skills/tailwind.svg' },
    { name: 'Riverpod', src: 'logos/skills/riverpod.svg' },
    { name: 'Ngrx', src: 'logos/skills/ngrx.svg' },
    { name: 'JWT', src: 'logos/skills/jwt.svg' },
    { name: 'Express', src: 'logos/skills/express.svg' },
    { name: 'Socket', src: 'logos/skills/socket.svg' },
    { name: 'Jest', src: 'logos/skills/jest.svg' },
  ],

  databases : [
    { name: 'MySQL', src: 'logos/skills/mysql.svg' },
    { name: 'PostgreSQL', src: 'logos/skills/postgresql.svg' },
    { name: 'MongoDB', src: 'logos/skills/mongodb.svg' },
  ],

  tools : [
    { name: 'Git', src: 'logos/skills/git.svg' },
    { name: 'Figma', src: 'logos/skills/figma.svg' },
    { name: 'Postman', src: 'logos/skills/postman.svg' },
  ],
  }
}
