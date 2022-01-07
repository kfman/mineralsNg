import {Component, OnInit} from '@angular/core';
import {
  AngularFirestore,
  DocumentSnapshot
} from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../../models/Sample';
import {CollectionNames} from '../../system-constants';
import {FormControl, FormGroup} from '@angular/forms';
import {ToastService} from '../../services/toast-service.service';


@Component({
  selector: 'app-edit-sample',
  templateUrl: './edit-sample.component.html',
  styleUrls: ['./edit-sample.component.css']
})
export class EditSampleComponent implements OnInit {

  public sample?: Sample;
  public form = new FormGroup({
    sideMineral: new FormControl(''),
    annotation: new FormControl(''),
    location: new FormControl(''),
    size: new FormControl(''),
    value: new FormControl(''),
    analytics: new FormControl(''),
    timeStamp: new FormControl(''),
  });

  // @formatter:off
  get mineral(){return this.form.get('mineral');}
  get sideMineral(){return this.form.get('sideMineral');}
  get annotation(){return this.form.get('annotation');}
  get location(){return this.form.get('location');}
  get size(){return this.form.get('size');}
  get value(){return this.form.get('value');}
  get analytics(){return this.form.get('analytics');}
  get timeStamp(){return this.form.get('timeStamp');}
  // @formatter:on

  private userId?: string;

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute,
              private auth: AngularFireAuth,
              private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      let id = p['id'];
      this.auth.user.subscribe((value => {
        this.userId = value?.uid;
        this.firestore.collection(CollectionNames.userCollection).doc(this.userId)
          .collection(CollectionNames.sampleCollection).doc(id).get().subscribe((value) => {
          this.sample = Sample.fromDocument(value as DocumentSnapshot<Sample>);
          // this.mineral?.setValue(this.sample.mineral);
          // this.sideMineral?.setValue(this.sample.sideMineral);
          // this.annotation?.setValue(this.sample.annotation);
          // this.location?.setValue(this.sample.location);
          // this.size?.setValue(this.sample.size);
          // this.value?.setValue(this.sample.value);
          // this.analytics?.setValue(this.sample.analytics);
          // this.timeStamp?.setValue(this.sample.timeStamp);
          console.log('Loaded...');

        });
      }));
    });
  }

  submitForm() {
    console.log(this.sample?.mineral);
  }

  doWhat() {
    this.sample = this.sample;
  }

  save() {
    console.log(this.sample!.toDocumentData());

    this.firestore.collection(CollectionNames.userCollection).doc(this.userId)
      .collection(CollectionNames.sampleCollection).doc(this.sample?.id).set(this.sample!.toDocumentData());

    this.toastService.show('Probe gespeichert', {
      classname: 'bg-success text-light',
      delay: 3000
    });
  }
}
