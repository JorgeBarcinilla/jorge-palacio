import { Pipe, PipeTransform } from '@angular/core';

/**
 *
 */
@Pipe({
  name: 'mapPipe',
  standalone: true, // si usas Angular 15+ con standalone components
})
export class MapPipe implements PipeTransform {
  /**
   * Transforma un array aplicando una función a cada elemento
   * @template T, R
   * @param {T[]} value - El array a transformar
   * @param {Function} callback - La función a aplicar a cada elemento
   * @returns {R[]} - Un nuevo array con los resultados de la función
   */
  transform<T, R>(
    value: T[],
    callback: (item: T, index: number, array: T[]) => R,
  ): R[] {
    if (!Array.isArray(value) || typeof callback !== 'function') return [];
    return value.map(callback);
  }
}

/**
 *
 */
@Pipe({
  name: 'pluckPipe',
  standalone: true,
})
export class PluckPipe implements PipeTransform {
  /**
   * Extrae una propiedad de cada objeto en un array
   * @template T, K extends keyof T
   * @param {T[]} array - Arreglo de objetos.
   * @param {K} key - La clave a extraer.
   * @returns {Array<T[K]>} - Los valores de esa propiedad.
   */
  transform<T>(array: T[], key: keyof T): T[keyof T][] {
    return Array.isArray(array) ? array.map((item) => item[key]) : array;
  }
}

/**
 *
 */
@Pipe({
  name: 'joinPipe',
  standalone: true, // para Angular 15+ o standalone components
})
export class JoinPipe implements PipeTransform {
  /**
   * Une los elementos de un array en una cadena
   * @param {T} value - El array a unir
   * @param {string} separator - El separador a utilizar
   * @returns {string} - La cadena resultante
   */
  transform<T>(value: T[], separator = ', '): string {
    if (!Array.isArray(value)) return '';
    return value.join(separator);
  }
}

/**
 *
 */
@Pipe({
  name: 'chunkPipe',
  standalone: true, // si estás usando Angular standalone
})
export class ChunkPipe implements PipeTransform {
  /**
   * Divide un array en trozos más pequeños.
   * @param {T[]} input - El array a dividir.
   * @param {number} size - El tamaño de cada trozo.
   * @returns {T[][]} - Un nuevo array con los trozos.
   */
  transform<T>(input: T[], size: number): T[][] {
    if (!Array.isArray(input) || size <= 0) return [];

    const chunks: T[][] = [];
    for (let i = 0; i < input.length; i += size) {
      chunks.push(input.slice(i, i + size));
    }

    return chunks;
  }
}

/**
 *
 */
@Pipe({
  name: 'splitEqualPipe',
  standalone: true,
})
export class SplitEqualPipe implements PipeTransform {
  /**
   * Divide un array en partes iguales.
   * @param {T[]} array - El array a dividir.
   * @param {number} parts - El número de partes en las que dividir el array.
   * @returns {T[][]} - Un nuevo array con las partes.
   */
  transform<T>(array: T[], parts: number): T[][] {
    if (!Array.isArray(array) || parts <= 0) return [];

    const length = array.length;
    const result: T[][] = [];

    let currentIndex = 0;
    const minSize = Math.floor(length / parts);
    const remainder = length % parts;

    for (let i = 0; i < parts; i++) {
      const size = i < remainder ? minSize + 1 : minSize;
      result.push(array.slice(currentIndex, currentIndex + size));
      currentIndex += size;
    }

    return result;
  }
}
