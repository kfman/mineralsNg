import {Component, OnInit} from '@angular/core';
import {PdfCreatorService} from '../services/pdf-creator.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private pdfService: PdfCreatorService) {
  }

  ngOnInit(): void {
  }

  createPdf() {
    this.pdfService.printerSetupPage();
  }
}
