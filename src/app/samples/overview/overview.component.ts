import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {IPrintSample, Sample} from '../../models/Sample';
import {PdfCreatorService} from '../../services/pdf-creator.service';
import {firstValueFrom} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MineralDatabaseService} from '../../services/mineral-database.service';
import {DataStateChangeEvent, GridDataResult} from '@progress/kendo-angular-grid';
import {process, State} from '@progress/kendo-data-query';
import {Page_GS} from '../../models/Page_GS';
import {ILabelPage} from '../../models/ILabelPage';
import {Page_2} from '../../models/Page_2';
import {Page_4} from '../../models/Page_4';
import {UserData} from '../../models/UserData';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  public sizeFilter?: string;
  public printedFilter: boolean = false;
  public samples: Sample[] = [];
  public unprintedGs: number = 0;
  public unprinted4: number = 0;
  public unprinted2: number = 0;
  public dialogOpened = false;
  public userData = new UserData();
  public loaded = false;

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

  public commitDialog: { opened: boolean, loading: boolean, samples: IPrintSample[] } = {
    opened: false,
    samples: [],
    loading: false,
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
    console.log('ngOnInit called');
    this.printedFilter = (await firstValueFrom(this.route.queryParamMap))
      .get('printed') == 'true' ?? false;
    this.samples = await this.database.getAll();
    this.samples = this.samples.sort((a, b) => {
      return b.sampleNumber.localeCompare(a.sampleNumber);
    });
    this.loadData();
    this.reloadLabelCounter();

    this.loaded = true;
    this.userData = await this.database.getUserData();
    this.gridView = process(this.samples, this.state);
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

  async generateLabels(size: string, alsoOld = false): Promise<void> {
    let samples = this.samples.filter(s => s.size == size && (!s.printed || alsoOld));
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
      case '4':
        page = new Page_4(samples);
        break;
      case '2':
        page = new Page_2(samples);
        break;
      default:
        break;

    }
    if (page) {
      let printed = this.pdfCreator.create(page);

      if (alsoOld) {
        return;
      }
      this.commitDialog.samples = printed;
      this.commitDialog.opened = true;
    }
  }

  async storeAsPrinted(samples: IPrintSample[]) {
    this.commitDialog.opened = false;
    this.loaded = false;
    await this.database.storeAsPrinted(samples);
    this.reloadLabelCounter();
    this.loaded = true;
  }

  formatPrinted(printed: string | Date) {
    if (!printed) return '';
    let printDate: Date = new Date(printed);
    return printDate.toLocaleDateString('de');
  }

  private reloadLabelCounter() {
    this.unprintedGs = this.samples.filter(s => s.size == 'GS' && !s.printed).length;
    this.unprinted4 = this.samples.filter(s => s.size == '4' && !s.printed).length;
    this.unprinted2 = this.samples.filter(s => s.size == '2' && !s.printed).length;
  }
}
