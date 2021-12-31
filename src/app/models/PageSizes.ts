import {IPrintSample} from './Sample';

export abstract class ILabelPage {
  height: number = 0;
  width: number = 0;
  columns: number = 0;
  rows: number = 0;
  xOffset: number = 0;
  yOffset: number = 0;
  rowOffset: number = 0;
  colOffset: number = 0;

  protected constructor(public samples: IPrintSample[]) {
  }

  getCellOffset(row: number, column: number): IOffset {
    return {
      x: row * this.width + this.xOffset,
      y: column * this.height + this.yOffset
    };
  };

  abstract labelFrom(sample: IPrintSample, row: number, column: number): any[];
}

export interface IOffset {
  x: number;
  y: number;
}


export class Page_GS extends ILabelPage {
  constructor(samples: IPrintSample[]) {
    super(samples);
    this.height = 34;
    this.width = 44;
    this.columns = 4;
    this.rows = 8;
    this.xOffset = 10;
    this.yOffset = 20;
    this.rowOffset = 5;
    this.colOffset = 5;
  }


  labelFrom(sample: IPrintSample, row: number, column: number): any[] {
    const cellOffset = super.getCellOffset(row, column);
    return [
      {
        text: sample.sampleNumber,
        absolutePosition: {x: cellOffset.x + 10, y: cellOffset.y + 10},
      },
      {
        text: sample.mineral,
        absolutePosition: {x: cellOffset.x + 10, y: cellOffset.y + 10},
      },
      {
        text: sample.location,
        absolutePosition: {x: cellOffset.x + 10, y: cellOffset.y + 10},
      },
      {
        text: sample.timeStamp,
        absolutePosition: {x: cellOffset.x + 10, y: cellOffset.y + 10},
      },
    ];

  };
}

export class Page_2 extends ILabelPage {
  labelFrom(sample: IPrintSample, row: number, column: number): any[] {
    return [];
  };


  constructor(samples: IPrintSample[]) {
    super(samples);
    this.height = 26;
    this.width = 32;
    this.columns = 6;
    this.rows = 10;
    this.xOffset = 10;
    this.yOffset = 20;
    this.rowOffset = 5;
    this.colOffset = 5;
  }

}

export class Page_4 extends ILabelPage {
  labelFrom(sample: IPrintSample, row: number, column: number): any[] {
    return [];
  };

  constructor(samples: IPrintSample[]) {
    super(samples);
    this.height = 29;
    this.width = 44;
    this.columns = 4;
    this.rows = 8;
    this.xOffset = 10;
    this.yOffset = 20;
    this.rowOffset = 5;
    this.colOffset = 5;
  }

}
