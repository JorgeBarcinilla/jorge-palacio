import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 *
 */
@Injectable({
  providedIn: 'root',
})
export class BrowserService {
  private _platformId = inject(PLATFORM_ID);

  /**
   * Determina si la aplicación se está ejecutando en un navegador
   * @returns {boolean} - Verdadero si está en un navegador, falso en caso contrario
   */
  isBrowser(): boolean {
    return isPlatformBrowser(this._platformId);
  }
}
