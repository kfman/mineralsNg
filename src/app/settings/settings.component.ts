import {Component, OnInit} from '@angular/core';
import {PdfCreatorService} from '../services/pdf-creator.service';
import {ToastService} from '../services/toast-service.service';
import {NumberingService} from '../services/numbering.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  numbering: string = 'KF 0000000';
  numbers: string[] | undefined;
  patternError = false;

  constructor(private pdfService: PdfCreatorService,
              private toastService: ToastService,
              private numberService: NumberingService) {
  }

  ngOnInit(): void {
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
}
