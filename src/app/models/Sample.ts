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
}
