import {Component, OnInit} from '@angular/core';
import {
  AngularFirestore,
  DocumentSnapshot
} from '@angular/fire/compat/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../../models/Sample';
import {CollectionNames} from '../../system-constants';
import {ToastService} from '../../services/toast-service.service';
import {UserData} from '../../models/UserData';
import {NumberingService} from '../../services/numbering.service';
import {firstValueFrom} from 'rxjs';


@Component({
  selector: 'app-edit-sample',
  templateUrl: './edit-sample.component.html',
  styleUrls: ['./edit-sample.component.css']
})
export class EditSampleComponent implements OnInit {

  public id: string = 'new';

  public sample?: Sample;
  private userId?: string;

  constructor(private firestore: AngularFirestore,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AngularFireAuth,
              private toastService: ToastService,
              private numbering: NumberingService
  ) {
  }

  async ngOnInit(): Promise<void> {

    this.userId = (await firstValueFrom(this.auth.user))?.uid;

    if (this.router.url.endsWith('new') ?? false) {
      console.log('Creating new sample');
      let sample = new Sample();
      this.firestore
        .collection(CollectionNames.userCollection).doc(this.userId)
        .get().subscribe((value) => {
        let userData = UserData.fromDocument(value);
        sample.sampleNumber = this.numbering.getNumber(userData?.pattern, ++userData.count);

        this.firestore
          .collection(CollectionNames.userCollection).doc(this.userId)
          .set(userData);
        this.sample = sample;
      });
      return;
    }

    this.route.params.subscribe(p => {
      this.id = p['id'];
      this.auth.user.subscribe((async value => {
        this.userId = value?.uid;


        this.firestore
          .collection(CollectionNames.userCollection).doc(this.userId)
          .collection(CollectionNames.sampleCollection).doc(this.id)
          .get().subscribe((value) => {
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
      this.firestore.collection(CollectionNames.userCollection).doc(this.userId)
        .collection(CollectionNames.sampleCollection).add(this.sample!.toDocumentData());
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
