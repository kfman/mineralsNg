import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Sample} from '../../models/Sample';
import {ToastService} from '../../services/toast-service.service';
import {NumberingService} from '../../services/numbering.service';
import {MineralDatabaseService} from '../../services/mineral-database.service';


@Component({
  selector: 'app-edit-sample',
  templateUrl: './edit-sample.component.html',
  styleUrls: ['./edit-sample.component.css']
})
export class EditSampleComponent implements OnInit, OnDestroy {

  public id: string = 'new';
  public loaded: boolean = false;
  public sample?: Sample;
  public deleted = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private database: MineralDatabaseService,
              private toastService: ToastService,
              private numbering: NumberingService
  ) {
  }

  async ngOnInit(): Promise<void> {
    if (this.router.url.endsWith('new') ?? false) {
      let sample = new Sample();
      sample.sampleNumber = await this.database.getSampleNumber();
      this.sample = sample;
      this.loaded = true;
      return;
    }

    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
      this.sample = await this.database.get(this.id);
      this.loaded = true;
    });

  }

  @HostListener('window:beforeunload')
  async ngOnDestroy(): Promise<void> {
    // if (this.deleted || !this.sample?.mineral) {
    //   return;
    // }
    //
    // if (this.sample) {
    //   if (this.id == 'new') {
    //     this.id = (await this.database.add(this.sample))!;
    //     let index = (await this.database.getUserData()).index;
    //     await this.database.updateUser({'index': ++index});
    //   } else {
    //     await this.database.update(this.id, this.sample);
    //   }
    // }
  }

  async delete(id: string) {
    this.deleted = true;
    if (id != 'new') {
      await this.database.delete(id);
    }
    await this.router.navigate(['/samples/overview']);
  }

  resetPrinted() {
    if (this.sample == null) {
      return;
    }

    this.sample!.printed = null;
  }

  async createDuplicate(sample: Sample, count: string | number = 1) {
    this.loaded = false;
    let result: string | null = null;
    if (typeof (count) === 'string')
      count = parseInt(count);

    for (let i = 0; i < count; i++) {

      let created = new Sample();
      Object.assign(created, sample);
      created.id = undefined;
      created.sampleNumber = await this.database.getSampleNumber();
      let index = (await this.database.getUserData()).index;
      await this.database.updateUser({'index': ++index});
      result = await this.database.add(created);
    }
    if (result) {
      await this.router.navigate([`/samples/overview`]);
    } else {
      this.loaded = false;
    }
  }
}
