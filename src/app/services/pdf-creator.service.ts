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
      pageSize: 'A4',
      content: labels,
    };

  }

  printerSetupPage() {
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
    const sizeGs = new Page_GS(dummies);
    const size4 = new Page_4(dummies);
    const size2 = new Page_2(dummies);

    let document: TDocumentDefinitions = {
      pageSize: 'A4',
      info: {
        title: 'MineralsNg',
        author: 'Klaus Fischer',
        subject: 'Label',
        keywords: 'Printer test pages',
      },
      styles: {
        sampleNumber: {
          fontSize: 12,
          bold: true,
          italics: false,
          alignment: 'center'
        },
        location: {
          fontSize: 6,
          bold: false,
          italics: true,
          alignment: 'center'
        },
        value: {
          fontSize: 6,
          bold: false,
          italics: false,
          alignment: 'center'
        },
        mineral: {
          fontSize: 10,
          bold: true,
          italics: false,
          alignment: 'center'
        },
        timeStamp: {
          fontSize: 10,
          bold: false,
          italics: true,
          alignment: 'center'
        }
      },
      content: [
        sizeGs.createPage(true),
        size4.createPage(true),
        size2.createPage(true)
      ]
    };
    pdfMake.createPdf(document).download('export.pdf');
  };

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

