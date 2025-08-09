import { Pipe, PipeTransform, Signal } from '@angular/core';

@Pipe({
  name: 'callSignal',
  standalone: true // si usas Angular 15+ con standalone components
})
export class CallSignalPipe implements PipeTransform {
  transform<T>(signal: Signal<T>): T {
    return signal();
  }
}