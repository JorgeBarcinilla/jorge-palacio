import {
  Directive,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { BrowserService } from '../../services/browser/browser';

/**
 *
 */
@Directive({
  selector: '[appScrollScale]',
  standalone: true,
})
export class ScrollScaleDirective implements OnDestroy, OnInit {
  @Input('appScrollScaleDecay') decay = 0.9;
  @Input('appScrollScaleEndScroll') endScroll: null | number = null;
  @Input('appScrollScaleMax') max = 1.2;
  @Input('appScrollScaleMin') min = 0.85;
  @Input('appScrollScaleReverse') reverse = false;
  @Input('appScrollScaleSensitivity') sensitivity = 0.003;
  @Input('appScrollScaleSmoothing') smoothing = 0.18;
  @Input('appScrollScaleStart') start = 1.0;
  @Input('appScrollScaleStartScroll') startScroll = 0;

  private _animating = false;
  private _baseHeight = 0;
  private _baseWidth = 0;
  private readonly _browser = inject(BrowserService);

  private readonly _el = inject(ElementRef<HTMLElement>)
    .nativeElement as HTMLElement;
  private _isBrowser = false;
  private _lastAppliedH = -1;
  private _lastAppliedW = -1;
  private _lastY = 0;
  private _onResize!: () => void;
  private _onScroll!: () => void;
  private _pendingDelta = 0;

  private readonly _r2 = inject(Renderer2);
  private _rafId = 0;
  private _ro: null | ResizeObserver = null;
  private _size = this.start; // factor relativo (sustituye a "scale")

  private _targetSize = this.start; // tamaño objetivo según scroll
  private readonly _zone = inject(NgZone);

  ngOnDestroy(): void {
    if (!this._isBrowser) return;
    if (this._onScroll) window.removeEventListener('scroll', this._onScroll);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this._rafId) cancelAnimationFrame(this._rafId);
    if (this._ro) this._ro.disconnect();
    this._el.style.removeProperty('width');
    this._el.style.removeProperty('height');
    this._el.style.removeProperty('will-change');
    this._el.style.removeProperty('contain');
  }

  ngOnInit(): void {
    this._isBrowser = this._browser.isBrowser();
    if (!this._isBrowser) return;

    // Normalizamos endScroll
    const end = this._end();
    if (end !== Infinity && end <= this.startScroll) {
      this.endScroll = this.startScroll + 1; // evita rango inválido
    }

    this.measureBaseSize();
    this._size = this.clamp(this.start, this.min, this.max);
    this.applySize();

    this._r2.setStyle(this._el, 'will-change', 'width, height');
    this._r2.setStyle(this._el, 'contain', 'layout paint');

    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(() => {
        const prevW = this._el.style.width;
        const prevH = this._el.style.height;
        this._el.style.width = '';
        this._el.style.height = '';
        this.measureBaseSize();
        this._el.style.width = prevW;
        this._el.style.height = prevH;
        this.applySize();
      });
      this._ro.observe(this._el);
    }

    this._zone.runOutsideAngular(() => {
      this._lastY = window.scrollY;

      this._onScroll = () => {
        const y = window.scrollY;
        this._targetSize = this._computeTarget(y);

        // Dispara un frame si no hay animación corriendo
        if (!this._animating) {
          this._animating = true;
          this._rafId = requestAnimationFrame(this.step);
        }
      };

      this._onResize = () => {
        const prevW = this._el.style.width;
        const prevH = this._el.style.height;
        this._el.style.width = '';
        this._el.style.height = '';
        this.measureBaseSize();
        this._el.style.width = prevW;
        this._el.style.height = prevH;
        this.applySize();
      };

      window.addEventListener('scroll', this._onScroll, { passive: true });
      window.addEventListener('resize', this._onResize, { passive: true });

      // Estado inicial respetando el rango
      const y0 = window.scrollY;
      if (!this._inRange(y0)) {
        // Antes del inicio: fijamos al tamaño "start" (clamped)
        if (y0 < this.startScroll) {
          this._size = this.clamp(this.start, this.min, this.max);
          this.applySize();
        }
        this._lastY = y0;
      }
    });
  }

  /**
   *
   * @param y
   */
  private _computeTarget(y: number) {
    const end = this.endScroll ?? Number.POSITIVE_INFINITY;
    if (y <= this.startScroll) {
      return this.clamp(this.start, this.min, this.max);
    }
    if (y >= end) {
      // al salir por el final, queda “pegado” al extremo coherente
      const t1 = 1; // fin del rango
      const t = this.reverse ? 1 - t1 : t1;
      return this.clamp(
        this.min + t * (this.max - this.min),
        this.min,
        this.max,
      );
    }

    // Normaliza 0..1 dentro del rango
    const tRaw = (y - this.startScroll) / (end - this.startScroll);
    const t = this.reverse ? 1 - tRaw : tRaw;

    return this.clamp(this.min + t * (this.max - this.min), this.min, this.max);
  }
  // --- Helpers de rango ---
  /**
   *
   */
  private _end(): number {
    return this.endScroll ?? Number.POSITIVE_INFINITY;
  }

  /**
   *
   * @param y
   */
  private _inRange(y: number): boolean {
    return y >= this.startScroll && y <= this._end();
  }

  // --- Aplicaciones de tamaño ---
  /**
   *
   */
  private applySize() {
    if (!this._baseWidth || !this._baseHeight) return;

    const w = this._baseWidth * this._size;
    const h = this._baseHeight * this._size;

    if (Math.abs(w - this._lastAppliedW) > 0.5) {
      this._el.style.width = `${w.toFixed(2)}px`;
      this._lastAppliedW = w;
    }
    if (Math.abs(h - this._lastAppliedH) > 0.5) {
      this._el.style.height = `${h.toFixed(2)}px`;
      this._lastAppliedH = h;
    }
  }

  /**
   *
   * @param v
   * @param a
   * @param b
   */
  private clamp(v: number, a: number, b: number): number {
    return Math.max(a, Math.min(b, v));
  }

  /**
   * Mide el tamaño base del elemento.
   */
  private measureBaseSize() {
    const prevTransform = this._el.style.transform;
    const prevW = this._el.style.width;
    const prevH = this._el.style.height;

    this._el.style.transform = 'none';
    this._el.style.width = '';
    this._el.style.height = '';

    const rect = this._el.getBoundingClientRect();
    this._baseWidth = rect.width;
    this._baseHeight = rect.height;

    this._el.style.transform = prevTransform;
    this._el.style.width = prevW;
    this._el.style.height = prevH;
  }

  // --- rAF loop ---
  private step = () => {
    // Suavizado exponencial hacia el target
    const s = this.clamp(this.smoothing, 0.01, 0.9); // seguridad
    const prev = this._size;
    this._size += (this._targetSize - this._size) * s;

    this.applySize();

    // Si ya estamos muy cerca, paramos; si no, seguimos
    if (
      Math.abs(this._size - this._targetSize) < 0.001 &&
      Math.abs(this._size - prev) < 0.001
    ) {
      this._animating = false;
      return;
    }
    this._rafId = requestAnimationFrame(this.step);
  };
}
