import firebase from 'firebase/compat';
import DocumentData = firebase.firestore.DocumentData;
import {QueryDocumentSnapshot} from '@angular/fire/compat/firestore';

export class Sample {
  public id: string = '';
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

  public static fromDocument(item: QueryDocumentSnapshot<Sample>): Sample {
    let result =  new Sample();
    result.id = item.id;
    result.mineral = item.get('mineral');
    return result;
  }

  constructor() {

  }
}
