import {
  Component,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BrowserService } from './shared/services/browser/browser';

/**
 *
 */
@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnDestroy, OnInit {
  protected readonly title = signal('jorge-palacio');

  private _angle1 = 0;
  private _angle2 = 180;
  private _animationRunning = false;

  private readonly _browser = inject(BrowserService);
  private _decay = 0.96; // suaviza frenado
  private _lastScrollY = 0;
  private _scale = 1.2;
  private _scaleDirection = 1;
  private _threshold = 0.02; // corta animación cuando casi no hay movimiento

  private _velocity = 0;
  private readonly _zone = inject(NgZone);

  /**
   * Anima el movimiento de los elementos (solo toca variables en <body>)
   */
  animateMovement(): void {
    const root = document.body;

    this._angle1 = (this._angle1 + this._velocity) % 360;
    this._angle2 = (this._angle2 - this._velocity * 1.1) % 360;

    const radius = 20;
    const center = 50;

    const rad1 = (this._angle1 * Math.PI) / 180;
    const rad2 = (this._angle2 * Math.PI) / 180;

    const x1 = center + radius * Math.cos(rad1);
    const y1 = center + radius * Math.sin(rad1);
    const x2 = center + radius * Math.cos(rad2);
    const y2 = center + radius * Math.sin(rad2);

    if (this._scale >= 1.25) this._scaleDirection = -1;
    if (this._scale <= 1.15) this._scaleDirection = 1;
    this._scale += 0.001 * this._scaleDirection;

    // 👇 actualizar SOLO en <body> evita recálculo global que ocurría con :root
    root.style.setProperty('--x1', `${x1}%`);
    root.style.setProperty('--y1', `${y1}%`);
    root.style.setProperty('--x2', `${x2}%`);
    root.style.setProperty('--y2', `${y2}%`);
    root.style.setProperty('--scale', this._scale.toFixed(2));

    // inercia
    this._velocity *= this._decay;

    if (Math.abs(this._velocity) > this._threshold) {
      requestAnimationFrame(() => this.animateMovement());
    } else {
      this._velocity = 0;
      this._animationRunning = false;
    }
  }

  ngOnDestroy(): void {
    if (this._browser.isBrowser()) {
      window.removeEventListener('scroll', this._onScroll);
    }
  }

  ngOnInit(): void {
    if (!this._browser.isBrowser()) return;

    // ajustes por preferencia del usuario / hardware modesto
    const prefersReduced = matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReduced) {
      this._decay = 0.9;
      this._threshold = 0.05;
    }

    this._lastScrollY = window.scrollY;

    // corre fuera de Angular y con listener pasivo para no bloquear el scroll
    this._zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this._onScroll, { passive: true });
    });

    // primer frame
    this.animateMovement();
  }

  // listener de scroll (arrow para conservar "this")
  private _onScroll = () => {
    const y = window.scrollY;
    const delta = y - this._lastScrollY;
    this._lastScrollY = y;

    // un toque más suave para móvil
    this._velocity += delta * 0.004;

    if (!this._animationRunning) {
      this._animationRunning = true;
      this.animateMovement();
    }
  };
}
