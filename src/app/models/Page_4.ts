import {IPrintSample} from './Sample';
import {StyleDictionary} from 'pdfmake/interfaces';
import {ILabelPage} from './ILabelPage';

export class Page_4 extends ILabelPage {
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
                text: sample.value,
                absolutePosition: {
                    x: cellOffset.innerX,
                    y: cellOffset.innerY + 40
                },
                style: 'value'
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

    constructor(samples: IPrintSample[]) {
        super(samples);
        this.height = 29;
        this.width = 44;
        this.columns = 4;
        this.rows = 8;
        this.xOffset = 10;
        this.yOffset = 20;
    }

}
