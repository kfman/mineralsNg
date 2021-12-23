import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../../models/Sample';
import firebase from 'firebase/compat';
import QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;

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
      this.firestore.collection('users').doc(v?.uid).collection('samples').get().subscribe(s => {
        for (let item of s.docs) {
          console.log(item);
          this.samples.push(Sample.fromDocument(item as QueryDocumentSnapshot<Sample>));
        }
      });
    });
  }
}
