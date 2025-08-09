import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapPipe',
  standalone: true // si usas Angular 15+ con standalone components
})
export class MapPipe implements PipeTransform {
  transform<T, R>(value: T[], callback: (item: T, index: number, array: T[]) => R): R[] {
    if (!Array.isArray(value) || typeof callback !== 'function') return [];
    return value.map(callback);
  }
}

@Pipe({
  name: 'pluckPipe',
  standalone: true
})
export class PluckPipe implements PipeTransform {
  transform<T>(array: T[], key: keyof T): T[keyof T][] {
    return Array.isArray(array) ? array.map(item => item[key]) : array;
  }
}

@Pipe({
  name: 'joinPipe',
  standalone: true // para Angular 15+ o standalone components
})
export class JoinPipe implements PipeTransform {
  transform(value: any[], separator: string = ', '): string {
    if (!Array.isArray(value)) return '';
    return value.join(separator);
  }
}

@Pipe({
  name: 'chunkPipe',
  standalone: true // si estás usando Angular standalone
})
export class ChunkPipe implements PipeTransform {
  transform<T>(input: T[], size: number): T[][] {
    if (!Array.isArray(input) || size <= 0) return [];

    const chunks: T[][] = [];
    for (let i = 0; i < input.length; i += size) {
      chunks.push(input.slice(i, i + size));
    }

    return chunks;
  }
}

@Pipe({
  name: 'splitEqualPipe',
  standalone: true
})
export class SplitEqualPipe implements PipeTransform {
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