import {IPrintSample} from './Sample';
import {StyleDictionary} from 'pdfmake/interfaces';
import {ILabelPage} from './ILabelPage';

export class Page_GS extends ILabelPage {
  constructor(samples: IPrintSample[]) {
    super(samples);
    this.height = 37;
    this.width = 50;
    this.columns = 4;
    this.rows = 8;
    this.xOffset = 5;
    this.yOffset = 0;
    this.innerCellOffsetY = 10;
  }

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
        text: sample.sideMineral,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 12
        },
        style: 'location'
      },
      {
        text: sample.location,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 24
        },
        style: 'location'
      },
      {
        text: `${sample.timeStamp}  ${sample.sampleNumber}`,
        absolutePosition: {
          x: cellOffset.innerX,
          y: cellOffset.innerY + 62
        },
        style: 'timeStamp'
      },
      // {
      //     text: sample.sideMineral,
      //     absolutePosition: {
      //         x: cellOffset.innerX,
      //         y: cellOffset.innerY + 40
      //     },
      //     style: 'sideMineral'
      // },
    ];
  };

  override getStyles(): StyleDictionary {
    return {
      sampleNumber: {
        fontSize: 10,
        bold: false,
        italics: false,
        alignment: 'center'
      },
      location: {
        fontSize: 10,
        bold: false,
        italics: false,
        alignment: 'center'
      },
      value: {
        fontSize: 1,
        bold: true,
        italics: false,
        alignment: 'center'
      },
      mineral: {
        fontSize: 12,
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
}
