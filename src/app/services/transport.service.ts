import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  section: EventEmitter<any> = new EventEmitter();
  index: EventEmitter<any> = new EventEmitter();
  exec = new BehaviorSubject<boolean>(false)
  constructor() { }
}
