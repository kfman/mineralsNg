import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../models/Sample';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.css']
})
export class SamplesComponent implements OnInit {

  public samples: Array<Sample> = [];

  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.auth.user.subscribe(v => {
      this.firestore.collection('users').doc(v?.uid).collection('samples').get().subscribe(s => {

        console.log(s);
      });
    });
  }

}
