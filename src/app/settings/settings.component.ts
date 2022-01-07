import {Component, OnInit} from '@angular/core';
import {PdfCreatorService} from '../services/pdf-creator.service';
import {ToastService} from '../services/toast-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private pdfService: PdfCreatorService, private toastService: ToastService) {
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
}
