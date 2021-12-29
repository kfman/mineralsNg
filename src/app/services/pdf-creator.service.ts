import {Injectable} from '@angular/core';
import {Sample} from '../models/Sample';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root'
})
export class PdfCreatorService {

  public static readonly Page_GS: ILabelPage = {
    height: 50,
    width: 20,
    columns: 6,
    rows: 20,
    xOffset: 10,
    yOffset: 20,
    rowOffset: 5,
    colOffset: 5
  };
  public static readonly Page_2: ILabelPage = {
    height: 50,
    width: 20,
    columns: 6,
    rows: 20,
    xOffset: 10,
    yOffset: 20,
    rowOffset: 5,
    colOffset: 5

  };
  public static readonly Page_4: ILabelPage = {
    height: 50,
    width: 20,
    columns: 6,
    rows: 20,
    xOffset: 10,
    yOffset: 20,
    rowOffset: 5,
    colOffset: 5

  };

  constructor() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  create(samples: Sample[], size: ILabelPage) {

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

export interface ILabelPage {
  height: number;
  width: number;
  columns: number;
  rows: number;
  xOffset: number;
  yOffset: number;
  rowOffset: number;
  colOffset: number;
}

