import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AngularFirestore,
  DocumentSnapshot
} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../../models/Sample';
import {CollectionNames} from '../../system-constants';
import {PdfCreatorService} from '../../services/pdf-creator.service';
import {Page_GS} from '../../models/Page_GS';
import {firstValueFrom, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit, OnDestroy {
  public samples: Sample[] = [];
  private subscription?: Subscription;
  public sizeFilter?: string;
  public printedFilter: boolean = false;

  constructor(private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private route: ActivatedRoute,
              private router: Router,
              private pdfCreator: PdfCreatorService) {
  }

  async ngOnInit(): Promise<void> {

    this.printedFilter = (await firstValueFrom(this.route.queryParamMap)).get('printed') == 'true' ?? false;

    this.auth.user.subscribe(v => {
      this.subscription = this.firestore.collection(CollectionNames.userCollection)
        .doc(v?.uid).collection(CollectionNames.sampleCollection,
          ref => ref.where('printed', this.printedFilter ? '==' : '!=', null)
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

  refresh(checked: boolean) {
    this.router.navigate(['samples/overview'], {queryParams: {'printed': checked}});
  }
}
