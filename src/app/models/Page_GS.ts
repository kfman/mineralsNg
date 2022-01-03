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
        this.yOffset = 1;
        this.innerCellOffsetY = 20;
    }

    override labelFrom(sample: IPrintSample, row: number, column: number): any[] {
        const cellOffset = super.getCellOffset(row, column);
        return [
            {
                text: sample.sampleNumber,
                absolutePosition: {
                    x: cellOffset.innerX,
                    y: cellOffset.innerY
                },
                style: 'sampleNumber'
            },
            {
                text: sample.mineral,
                absolutePosition: {
                    x: cellOffset.innerX,
                    y: cellOffset.innerY + 10
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
                text: sample.timeStamp,
                absolutePosition: {
                    x: cellOffset.innerX,
                    y: cellOffset.innerY + 30
                },
                style: 'timeStamp'
            },
            {
                text: sample.sideMineral,
                absolutePosition: {
                    x: cellOffset.innerX,
                    y: cellOffset.innerY + 40
                },
                style: 'sideMineral'
            },
        ];
    };

    override getStyles(): StyleDictionary {
        return {
            sampleNumber: {
                fontSize: 12,
                bold: true,
                italics: false,
                alignment: 'center'
            },
            location: {
                fontSize: 10,
                bold: true,
                italics: false,
                alignment: 'right'
            },
            value: {
                fontSize: 10,
                bold: true,
                italics: false,
                alignment: 'left'
            },
            mineral: {
                fontSize: 10,
                bold: true,
                italics: false,
                alignment: 'center'
            },
            timeStamp: {
                fontSize: 8,
                bold: true,
                italics: false,
                alignment: 'center'
            }
        };
    }
}
