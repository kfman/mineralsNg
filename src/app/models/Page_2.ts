import {IPrintSample} from './Sample';
import {StyleDictionary} from 'pdfmake/interfaces';
import {ILabelPage} from './ILabelPage';

export class Page_2 extends ILabelPage {
  override labelFrom(sample: IPrintSample, row: number, column: number): any[] {
    const cellOffset = super.getCellOffset(row, column);
    return [
      {
        text: sample.mineral,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY
        },
        style: 'mineral'
      },
      {
        text: sample.location,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 20
        },
        style: 'location'
      },
      {
        text: `${sample.timeStamp} ${sample.sampleNumber}`,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 45
        },
        style: 'timeStamp'
      },
      {
        text: sample.sideMineral,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 10
        },
        style: 'sideMineral'
      },
    ];
  };

  override getStyles(): StyleDictionary {
    return {
      sampleNumber: {
        fontSize: 6,
        bold: true,
        italics: false,
        alignment: 'center'
      },
      location: {
        fontSize: 6,
        bold: false,
        italics: false,
        alignment: 'center'
      },
      sideMineral: {
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
        fontSize: 4,
        bold: false,
        italics: false,
        alignment: 'center'
      }
    };
  }


  constructor(samples: IPrintSample[]) {
    super(samples);
    this.height = 28;
    this.width = 35;
    this.columns = 6;
    this.rows = 10;
    this.xOffset = 1;
    this.yOffset = 8;
  }

}
