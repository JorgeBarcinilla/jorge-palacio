import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BrowserService } from './shared/services/browser/browser';

/**
 * Componente principal de la aplicación
 */
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('jorge-palacio');

  private _angle1 = 0;
  private _angle2 = 180;
  private _animationRunning = false;
  private _browser = inject(BrowserService);

  private _decay = 0.96; // 🔁 Suaviza el frenado

  private _lastScrollY = 0;
  private _scale = 1.2;
  private _scaleDirection = 1;
  private _threshold = 0.02; // 🔚 Detiene cuando ya casi no hay movimiento

  private _velocity = 0;

  /**
   * Anima el movimiento de los elementos
   */
  animateMovement(): void {
    const root = document.documentElement;

    this._angle1 = (this._angle1 + this._velocity) % 360;
    this._angle2 = (this._angle2 - this._velocity * 1.1) % 360;

    const radius = 20;
    const center = 50;

    const x1 = center + radius * Math.cos((this._angle1 * Math.PI) / 180);
    const y1 = center + radius * Math.sin((this._angle1 * Math.PI) / 180);
    const x2 = center + radius * Math.cos((this._angle2 * Math.PI) / 180);
    const y2 = center + radius * Math.sin((this._angle2 * Math.PI) / 180);

    if (this._scale >= 1.25) this._scaleDirection = -1;
    if (this._scale <= 1.15) this._scaleDirection = 1;
    this._scale += 0.001 * this._scaleDirection;

    root.style.setProperty('--x1', `${x1}%`);
    root.style.setProperty('--y1', `${y1}%`);
    root.style.setProperty('--x2', `${x2}%`);
    root.style.setProperty('--y2', `${y2}%`);
    root.style.setProperty('--scale', this._scale.toFixed(2));

    this._velocity *= this._decay;

    if (Math.abs(this._velocity) > this._threshold) {
      requestAnimationFrame(() => this.animateMovement());
    } else {
      this._velocity = 0;
      this._animationRunning = false;
    }
  }

  ngOnInit(): void {
    if (!this._browser.isBrowser()) return;
    this._lastScrollY = window.scrollY;
    this.animateMovement();
  }

  /**
   * Detecta el scroll y ajusta la velocidad del movimiento
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const delta = window.scrollY - this._lastScrollY;
    this._lastScrollY = window.scrollY;

    this._velocity += delta * 0.005; // 👈 MÁS SUAVE aquí

    if (!this._animationRunning) {
      this._animationRunning = true;
      this.animateMovement();
    }
  }
}
