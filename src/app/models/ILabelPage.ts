import {IPrintSample} from './Sample';
import {StyleDictionary} from 'pdfmake/interfaces';

export interface IOffset {
  cellX: number;
  cellY: number;
  innerX: number;
  innerY: number;
  centerX: number;
  centerY: number;
}

export abstract class ILabelPage {
  height: number = 0;
  width: number = 0;
  columns: number = 0;
  rows: number = 0;
  xOffset: number = 0;
  yOffset: number = 0;
  innerCellOffsetY: number = 0;

  readonly pageWidth = 595.0;
  readonly pageHeight = 841.0;

  get heightPx() {
    return this.height * this.pageHeight / 297.0;
  }

  get widthPx() {
    return this.width * this.pageWidth / 210.0;
  }

  protected constructor(public samples: IPrintSample[]) {
  }

  // Page dimensions: width: 210mm = 595px
  // Page dimensions: height: 297mm = 841px

  /**
   * Retruns the cell coordinates in pixel
   * @param row
   * @param column
   */
  getCellOffset(row: number, column: number): IOffset {
    const cellX = (column * this.width + this.xOffset) * 595.0 / 210.0;
    const cellY = (row * this.height + this.yOffset) * 841.0 / 297.0;
    const centerX = cellX + this.widthPx - this.pageWidth + column * this.widthPx;
    const innerX = centerX + this.xOffset * 2;

    return {
      cellX,
      cellY,
      innerX,
      innerY: cellY + this.innerCellOffsetY + this.yOffset,
      centerX,
      centerY: cellY + this.heightPx / 2
    };
  };


  abstract getStyles(): StyleDictionary;

  abstract labelFrom(sample: IPrintSample, row: number, column: number): any[];

  createPage(showGrid: boolean = false): any[] {
    let result = [];
    let canvas_items = [];
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        const sample = this.samples[column + row * this.columns];
        if (showGrid) {
          const offset = this.getCellOffset(row, column);
          canvas_items.push(
            {
              type: 'rect',
              x: offset.cellX,
              y: offset.cellY,
              w: this.widthPx,
              h: this.heightPx
            }
          );
        }
        result.push(this.labelFrom(sample, row, column));
      }

    }
    result.push({canvas: canvas_items});
    return result;
  }
}


