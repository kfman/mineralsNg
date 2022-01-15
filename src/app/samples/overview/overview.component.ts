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
import {MineralDatabaseService} from '../../services/mineral-database.service';

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
              private database: MineralDatabaseService,
              private pdfCreator: PdfCreatorService) {
  }

  async ngOnInit(): Promise<void> {

    this.printedFilter = (await firstValueFrom(this.route.queryParamMap)).get('printed') == 'true' ?? false;
    this.samples = await this.database.getAll();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  refresh(checked: boolean) {
    this.router.navigate(['samples/overview'], {queryParams: {'printed': checked}});
  }
}
