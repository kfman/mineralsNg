import {Component, OnInit} from '@angular/core';
import {PdfCreatorService} from '../services/pdf-creator.service';
import {ToastService} from '../services/toast-service.service';
import {NumberingService} from '../services/numbering.service';
import {MineralDatabaseService} from '../services/mineral-database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  numbering: string = '';
  numbers: string[] | undefined;
  patternError = false;
  name: string = '';
  index: number = 0;
  indexError: boolean = false;

  constructor(private pdfService: PdfCreatorService,
              private toastService: ToastService,
              private database: MineralDatabaseService,
              private numberService: NumberingService) {
  }

  async ngOnInit(): Promise<void> {
    this.numbering = await this.database.getPattern();
    this.name = await this.database.getName();
    this.index = await this.database.getIndex();
  }

  createPdf() {
    this.pdfService.printerSetupPage();
  }

  testToast() {
    this.toastService.show('This is a toast...', {
      classname: 'bg-success text-light',
      delay: 10000
    });
    console.log('Showing');
  }

  testNumbers() {
    try {
      this.numberService.getNumber(this.numbering, 0);
      this.patternError = false;
    } catch (e) {
      this.patternError = true;
      this.toastService.show('Pattern ungültig',
        {classname: 'bg-danger text-light', delay: 15000});
    }
  }

  async testDbLoad() {
    let temp = await this.database.getAll(true);
    console.log(temp);
  }

  async savePattern() {
    await this.database.updateUser({'pattern': this.numbering});
  }

  async saveName() {
    await this.database.updateUser({'name': this.name});
  }

  async saveIndex() {
    await this.database.updateUser({'index': this.index});
  }
}
