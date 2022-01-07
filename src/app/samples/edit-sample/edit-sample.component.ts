import {Component, OnInit} from '@angular/core';
import {
  AngularFirestore,
  DocumentSnapshot
} from '@angular/fire/compat/firestore';
import {ActivatedRoute} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../../models/Sample';
import {CollectionNames} from '../../system-constants';
import {ToastService} from '../../services/toast-service.service';


@Component({
  selector: 'app-edit-sample',
  templateUrl: './edit-sample.component.html',
  styleUrls: ['./edit-sample.component.css']
})
export class EditSampleComponent implements OnInit {

  public id: string = 'new';

  public sample?: Sample;
  private userId?: string;

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute,
              private auth: AngularFireAuth,
              private toastService: ToastService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(p => {
      this.id = p['id'];
      this.auth.user.subscribe((value => {
        this.userId = value?.uid;
        if (this.id == 'new') {
          this.sample = new Sample();
          return;
        }

        this.firestore.collection(CollectionNames.userCollection).doc(this.userId)
          .collection(CollectionNames.sampleCollection).doc(this.id).get().subscribe((value) => {
          this.sample = Sample.fromDocument(value as DocumentSnapshot<Sample>);
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

    if (this.id == 'new') {
      console.log('neue Probe speichern....');
    } else {
      this.firestore.collection(CollectionNames.userCollection).doc(this.userId)
        .collection(CollectionNames.sampleCollection).doc(this.sample?.id).set(this.sample!.toDocumentData());
    }
    this.toastService.show('Probe gespeichert', {
      classname: 'bg-success text-light',
      delay: 3000
    });
  }
}
