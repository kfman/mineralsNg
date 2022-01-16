import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Sample} from '../../models/Sample';
import {ToastService} from '../../services/toast-service.service';
import {UserData} from '../../models/UserData';
import {NumberingService} from '../../services/numbering.service';
import {firstValueFrom, Subscription} from 'rxjs';
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

    this.id = (await firstValueFrom(this.route.params))['id'];
    this.sample = await this.database.get(this.id);
    this.loaded = true;
  }

  async save() {

    if (this.id == 'new') {
      let id = await this.database.add(this.sample!);
      this.router.navigate([`/samples/${id}`]);
      return;
    } else {
      await this.database.update(this.id, this.sample!);
    }
    this.toastService.show('Probe gespeichert', {
      classname: 'bg-success text-light',
      delay: 3000
    });
  }

  async ngOnDestroy(): Promise<void> {
    if (this.sample)
      await this.database.update(this.id, this.sample);
  }

  async delete(id: string) {
    if (id != 'new') {
      await this.database.delete(id);
    }
    this.router.navigate(['/samples/overview']);
  }

  resetPrinted() {
    if (this.sample == null) {
      return;
    }

    this.sample!.printed = null;
  }
}
