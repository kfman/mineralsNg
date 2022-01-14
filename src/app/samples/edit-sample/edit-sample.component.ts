import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {firstValueFrom, Subscription} from 'rxjs';


@Component({
  selector: 'app-edit-sample',
  templateUrl: './edit-sample.component.html',
  styleUrls: ['./edit-sample.component.css']
})
export class EditSampleComponent implements OnInit, OnDestroy {

  public id: string = 'new';
  public sample?: Sample;
  private userId?: string;
  private subscription?: Subscription;
  private userData?: UserData;

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
      let sample = new Sample();
      let value = await firstValueFrom(this.firestore
        .collection(CollectionNames.userCollection).doc(this.userId)
        .get());
      this.userData = UserData.fromDocument(value);
      sample.sampleNumber = this.numbering.getNumber(this.userData?.pattern, ++this.userData.count);

      this.sample = sample;
      return;
    }

    this.id = (await firstValueFrom(this.route.params))['id'];

    this.subscription = this.firestore
      .collection(CollectionNames.userCollection).doc(this.userId)
      .collection(CollectionNames.sampleCollection).doc(this.id)
      .get().subscribe((value) => {
        this.sample = Sample.fromDocument(value as DocumentSnapshot<Sample>);
        console.log('Loaded...', Date.now());
      });
  }

  submitForm() {
    console.log(this.sample?.mineral);
  }

  doWhat() {
    this.sample = this.sample;
  }

  async save() {
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

    if (this.userData) {
      await this.firestore
        .collection(CollectionNames.userCollection).doc(this.userId)
        .set(this.userData);

    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
