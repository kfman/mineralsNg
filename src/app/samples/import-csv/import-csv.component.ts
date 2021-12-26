import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})
export class ImportCsvComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  async readFile(files: FileList | null) {
    if ((files?.length ?? 0) == 0) {
      return;
    }

    let file = files!.item(0)!;
    console.log(file);
    let fileReader: FileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(e);
      console.log(fileReader.result);
    };
    fileReader.readAsText(file, 'UTF-8');
  }
}
