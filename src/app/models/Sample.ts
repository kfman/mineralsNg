import {DocumentSnapshot} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import DocumentData = firebase.firestore.DocumentData;


export class Sample {
  public id: string | undefined = undefined;
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
      sampleNumber: this.sampleNumber,
      analytics: this.analytics,
      annotation: this.annotation,
      imageName: this.imageName,
      location: this.location,
      mineral: this.mineral,
      origin: this.origin,
      serial: this.serial,
      sideMineral: this.sideMineral,
      size: this.size,
      timeStamp: this.timeStamp,
      value: this.value
    };
  }
}
