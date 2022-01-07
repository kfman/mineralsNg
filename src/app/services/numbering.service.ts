import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberingService {

  constructor() {
  }

  getNumber(pattern: string, index: number): string {

    if (!RegExp('^[a-zA-Z ]+[0-9]+$').test(pattern)) {
      throw new Error('Pattern is invalid');
    }

    const regExFixed = RegExp('[a-zA-Z ]+');
    const fixed = regExFixed.exec(pattern);

    let variable = RegExp('[0-9]+').exec(pattern)![0];

    let runner = index.toString();
    while (runner.length < variable!.length) {
      runner = '0' + runner;
    }

    return fixed + runner;

  }
}
