import {Injectable} from '@angular/core';
import {IPrintSample} from '../models/Sample';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ILabelPage, Page_GS, Page_2, Page_4} from '../models/PageSizes';
import {TDocumentDefinitions} from 'pdfmake/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PdfCreatorService {


  constructor() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  create(page: ILabelPage) {
    let pageSamples = [];

    let labels = [];
    for (let i = 0; i < page.width * page.height; i++) {
      const temp = page.labelFrom(page.samples[i], 0, 0);
      labels.push(temp);
    }

    let document: TDocumentDefinitions = {
      content: labels,
    };

  }

  printerSetupPage(size: ILabelPage) {
    let dummies: IPrintSample[] = [];

    for (let i = 0; i < 100; i++) {
      dummies.push({
          sampleNumber: `TS${i.toString().padStart(6, '0')}`,
          mineral: 'AURUM',
          value: i,
          location: 'SAMPLE',
          timeStamp: '01/1900'
        }
      );
    }
    new Page_GS(dummies);
    new Page_4(dummies);
    new Page_2(dummies);
  }

  createDummy() {
    let document = {
      content: [
        {
          text: 'As',
          absolutePosition: {x: 100, y: 100}
        },
        {
          table: {
            absolutePosition: {x: 150, y: 150},
            headerRows: 1,
            widths: ['*', 'auto', 100, '*'],
            body: [
              ['First', 'Second', 'Third', 'fourth'],
              ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
              [{text: 'Bold value', bold: true}, 'Val 2', 'Val 3', 'Val 4']
            ]
          }
        }]

    };
    pdfMake.createPdf(document).download('export.pdf');
  }
}

