import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Sample} from '../../models/Sample';
import {PdfCreatorService} from '../../services/pdf-creator.service';
import {firstValueFrom, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MineralDatabaseService} from '../../services/mineral-database.service';
import {
  DataStateChangeEvent,
  GridDataResult
} from '@progress/kendo-angular-grid';
import {process, State} from '@progress/kendo-data-query';
import {Page_GS} from '../../models/Page_GS';
import {ILabelPage} from '../../models/ILabelPage';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private subscription?: Subscription;
  public sizeFilter?: string;
  public printedFilter: boolean = false;
  public samples: Sample[] = [];
  public unprintedGs: number = 0;
  public unprinted4: number = 0;
  public unprinted2: number = 0;
  public dialogOpened = false;

  public state: State = {
    skip: 0,
    take: 50,
    sort: [{
      field: 'sampleNumber',
      dir: 'desc'
    }]
  };

  public dialogState = {
    opened: false,
    message: 'Keine Etiketten in der Größe'
  };

  public gridView: GridDataResult = process(this.samples, this.state);


  constructor(private firestore: AngularFirestore,
              private auth: AngularFireAuth,
              private route: ActivatedRoute,
              private router: Router,
              private database: MineralDatabaseService,
              private pdfCreator: PdfCreatorService) {
    this.gridView = {data: [], total: 0};
  }

  async ngOnInit(): Promise<void> {
    this.printedFilter = (await firstValueFrom(this.route.queryParamMap))
      .get('printed') == 'true' ?? false;
    this.samples = (await this.database.getAll());
    this.loadData();

    this.unprintedGs = this.samples.filter(s => s.size == 'GS' && s.printed == null).length;
    this.unprinted4 = this.samples.filter(s => s.size == '4' && s.printed == null).length;
    this.unprinted2 = this.samples.filter(s => s.size == '2' && s.printed == null).length;
  }

  loadData() {
    this.gridView = process(this.samples, this.state);
  }

  refresh(checked: boolean) {
    this.router.navigate(
      ['samples/overview'],
      {queryParams: {'printed': checked}}
    );
  }

  dataChanged(event: DataStateChangeEvent) {
    this.state = event;
    this.gridView = process(this.samples, this.state);
  }

  async generateLabels(size: string): Promise<void> {
    let samples = this.samples.filter(s => s.size == size && s.printed == null);
    if (samples.length == 0) {
      this.dialogState.message = `Keine Etiketten in der Größe ${size}`;
      this.dialogState.opened = true;
      return;
    }

    let page: ILabelPage | undefined = undefined;
    switch (size) {
      case 'GS':
        page = new Page_GS(samples);
        break;
      default:
        break;

    }
    if (page) {
      this.pdfCreator.create(page);
    }
  }
}
