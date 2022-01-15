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
import {GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';

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
  pageSize: number = 20;
  skip: number = 0;
  allData: Sample[] = [];
  public gridView: GridDataResult;


  constructor(private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private route: ActivatedRoute,
              private router: Router,
              private database: MineralDatabaseService,
              private pdfCreator: PdfCreatorService) {
    this.gridView = {data:[], total: 0};
  }

  async ngOnInit(): Promise<void> {
    this.printedFilter = (await firstValueFrom(this.route.queryParamMap)).get('printed') == 'true' ?? false;
    this.allData = (await this.database.getAll());
    this.loadData()
  }

  loadData(){
    this.gridView = {
      data: this.allData.slice(this.skip, this.skip + this.pageSize),
      total: this.allData.length
    };
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  refresh(checked: boolean) {
    this.router.navigate(['samples/overview'], {queryParams: {'printed': checked}});
  }

  pageChange(event: PageChangeEvent) {
    this.skip = event.skip;
    this.loadData()
  }
}
