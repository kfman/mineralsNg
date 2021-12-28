import {Component, OnInit} from '@angular/core';
import {
  AngularFirestore,
  DocumentSnapshot
} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../../models/Sample';
import firebase from 'firebase/compat';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
import {CollectionNames} from '../../system-constants';
import {limit, orderBy} from '@angular/fire/firestore';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  public samples: Sample[] = [];

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.auth.user.subscribe(v => {
      this.firestore.collection(CollectionNames.userCollection).doc(v?.uid)
        .collection(CollectionNames.sampleCollection, ref => ref.orderBy('sampleNumber', 'desc').limit(20)).get().subscribe(s => {
        let temp: Sample[] = [];
        for (let item of s.docs) {
          temp.push(Sample.fromDocument(item as DocumentSnapshot<Sample>));
          console.log(item);
        }
        this.samples = temp.sort((a, b) => b.sampleNumber.localeCompare(a.sampleNumber));
      });
    });
  }
}
