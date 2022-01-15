import {DocumentSnapshot} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';

export interface IPrintSample {
  mineral: string;
  sideMineral: string;
  location: string;
  timeStamp: string;
  sampleNumber: string;
}

export class Sample implements IPrintSample {
  public id?: string = undefined;
  public sampleNumber: string = '';
  public analytics: string = '';
  public annotation: string = '';
  public imageName: string = '';
  public location: string = '';
  public mineral: string = '';
  public origin: string = '';
  public serial: string = '';
  public sideMineral: string = '';
  public size: string = '';
  public timeStamp: string = '';
  public value: number = 0;
  public printed: string = '';


  public static fromDocument(item: DocumentSnapshot<Sample>): Sample {
    let result = new Sample();
    result.id = item.id;
    result.sampleNumber = item.get('sampleNumber');
    result.analytics = item.get('analytics');
    result.annotation = item.get('annotation');
    result.imageName = item.get('imageName');
    result.location = item.get('location');
    result.mineral = item.get('mineral');
    result.origin = item.get('origin');
    result.serial = item.get('serial');
    result.sideMineral = item.get('sideMineral');
    result.size = item.get('size');
    result.timeStamp = item.get('timeStamp');
    result.value = item.get('value');
    return result;
  }

  constructor() {

  }

  toDocumentData() {
    return {
      id: this.id,
      sampleNumber: this.sampleNumber,
      analytics: this.analytics ?? null,
      annotation: this.annotation ?? null,
      imageName: this.imageName ?? null,
      location: this.location ?? null,
      mineral: this.mineral ?? null,
      origin: this.origin ?? null,
      serial: this.serial ?? null,
      sideMineral: this.sideMineral ?? null,
      size: this.size ?? null,
      timeStamp: this.timeStamp ?? null,
      value: this.value ?? 0
    };
  }
}
