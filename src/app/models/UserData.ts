import firebase from 'firebase/compat';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

export class UserData {
  public name?: string;
  public pattern: string = 'MIN 000000';
  public index: number = 0;
  public isAdmin:boolean = false;


  public toDocument() {
    return {

    };
  }


  public static fromDocument(item: firebase.firestore.DocumentSnapshot<unknown>): UserData {
    return item.data() as UserData;
  }
}
