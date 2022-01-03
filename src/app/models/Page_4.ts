import {IPrintSample} from './Sample';
import {StyleDictionary} from 'pdfmake/interfaces';
import {ILabelPage} from './ILabelPage';

export class Page_4 extends ILabelPage {
  override labelFrom(sample: IPrintSample, row: number, column: number): any[] {
    const cellOffset = super.getCellOffset(row, column);
    return [
      {
        text: sample.mineral,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 10
        },
        style: 'mineral'
      },
      {
        text: sample.sideMineral,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 20
        },
        style: 'sideMineral'
      },
      {
        text: sample.location,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 30
        },
        style: 'location'
      },
      {
        text: `${sample.timeStamp} ${sample.sampleNumber}`,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 40
        },
        style: 'timeStamp'
      },
    ];
  };

  override getStyles(): StyleDictionary {
    return {
      mineral: {
        fontSize: 12,
        bold: true,
        italics: false,
        alignment: 'center'
      },
      location: {
        fontSize: 10,
        bold: true,
        italics: false,
        alignment: 'center'
      },
      sideMineral: {
        fontSize: 10,
        bold: false,
        italics: false,
        alignment: 'center'
      },
      sampleNumber: {
        fontSize: 10,
        bold: true,
        italics: false,
        alignment: 'center'
      },
      timeStamp: {
        fontSize: 10,
        bold: true,
        italics: false,
        alignment: 'center'
      }
    };
  }

  constructor(samples: IPrintSample[]) {
    super(samples);
    this.height = 34;
    this.width = 50;
    this.columns = 4;
    this.rows = 8;
    this.xOffset = 5;
    this.yOffset = 12;
  }

}
