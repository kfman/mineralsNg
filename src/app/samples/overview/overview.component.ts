import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {PdfCreatorService} from '../../services/pdf-creator.service';
import {Page_GS} from '../../models/Page_GS';
import {firstValueFrom, Observable, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {
  public samples: Sample[] = [];
  private subscription?: Subscription;

  constructor(private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private route: ActivatedRoute,
              private pdfCreator: PdfCreatorService) {
  }

  async ngOnInit(): Promise<void> {

    let printed: boolean = (await firstValueFrom(this.route.queryParamMap)).get('printed') == 'true' ?? false;

    this.auth.user.subscribe(v => {
      this.subscription = this.firestore.collection(CollectionNames.userCollection)
        .doc(v?.uid).collection(CollectionNames.sampleCollection,
          ref => printed
            ? ref
            : ref // (ref.where('printed', '==', null))
              .orderBy('sampleNumber', 'desc').limit(20)
        ).get().subscribe(s => {
          let temp: Sample[] = [];
          for (let item of s.docs) {
            temp.push(Sample.fromDocument(item as DocumentSnapshot<Sample>));
            console.log(item);
          }
          this.samples = temp.sort((a, b) => b.sampleNumber.localeCompare(a.sampleNumber));
        });
    });
  }

  createPdf(): void {
    this.pdfCreator.create(new Page_GS(this.samples));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
