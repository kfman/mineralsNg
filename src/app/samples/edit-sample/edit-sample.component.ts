import {Component, OnInit} from '@angular/core';
import {
  AngularFirestore,
  DocumentSnapshot
} from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../../models/Sample';
import {CollectionNames} from '../../system-constants';


@Component({
  selector: 'app-edit-sample',
  templateUrl: './edit-sample.component.html',
  styleUrls: ['./edit-sample.component.css']
})
export class EditSampleComponent implements OnInit {

  public sample: Sample | null = null;

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute,
              private auth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      let id = p['id'];
      this.auth.user.subscribe((value => {
        const userId = value?.uid;
        this.firestore.collection(CollectionNames.userCollection).doc(userId)
          .collection(CollectionNames.sampleCollection).doc(id).get().subscribe((value) => {
          this.sample = Sample.fromDocument(value as DocumentSnapshot<Sample>);
          console.log(value.ref);
          console.log(this.sample)
        });
      }));
    });
  }

}
