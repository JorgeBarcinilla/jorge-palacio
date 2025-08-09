import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BrowserService } from './shared/services/browser/browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('jorge-palacio');

 private angle1 = 0;
  private angle2 = 180;
  private scale = 1.2;
  private scaleDirection = 1;

  private lastScrollY = 0;

  private velocity = 0;
  private decay = 0.96;        // 🔁 Suaviza el frenado
  private threshold = 0.02;    // 🔚 Detiene cuando ya casi no hay movimiento
  private animationRunning = false;

  constructor(private browser: BrowserService) {}

  ngOnInit(): void {
    if(!this.browser.isBrowser()) return;
    this.lastScrollY = window.scrollY;
    this.animateMovement();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const delta = window.scrollY - this.lastScrollY;
    this.lastScrollY = window.scrollY;

    this.velocity += delta * 0.005; // 👈 MÁS SUAVE aquí

    if (!this.animationRunning) {
      this.animationRunning = true;
      this.animateMovement();
    }
  }

  animateMovement(): void {
    const root = document.documentElement;

    this.angle1 = (this.angle1 + this.velocity) % 360;
    this.angle2 = (this.angle2 - this.velocity * 1.1) % 360;

    const radius = 20;
    const center = 50;

    const x1 = center + radius * Math.cos(this.angle1 * Math.PI / 180);
    const y1 = center + radius * Math.sin(this.angle1 * Math.PI / 180);
    const x2 = center + radius * Math.cos(this.angle2 * Math.PI / 180);
    const y2 = center + radius * Math.sin(this.angle2 * Math.PI / 180);

    if (this.scale >= 1.25) this.scaleDirection = -1;
    if (this.scale <= 1.15) this.scaleDirection = 1;
    this.scale += 0.001 * this.scaleDirection;

    root.style.setProperty('--x1', `${x1}%`);
    root.style.setProperty('--y1', `${y1}%`);
    root.style.setProperty('--x2', `${x2}%`);
    root.style.setProperty('--y2', `${y2}%`);
    root.style.setProperty('--scale', this.scale.toFixed(2));

    this.velocity *= this.decay;

    if (Math.abs(this.velocity) > this.threshold) {
      requestAnimationFrame(() => this.animateMovement());
    } else {
      this.velocity = 0;
      this.animationRunning = false;
    }
  }
}
