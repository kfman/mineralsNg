import {Component, OnInit} from '@angular/core';
import {Sample} from '../../models/Sample';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {CollectionNames} from '../../system-constants';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {MineralDatabaseService} from '../../services/mineral-database.service';

@Component({
  selector: 'app-import-csv',
  templateUrl: './import-csv.component.html',
  styleUrls: ['./import-csv.component.css']
})
export class ImportCsvComponent implements OnInit {
  private useRealTimeDatabase = true;
  public samples: Sample[] = [];
  public userId: string | undefined = undefined;
  public count?: number;

  constructor(private firestore: AngularFirestore,
              private firebase: AngularFireDatabase,
              private router: Router,
              private database: MineralDatabaseService,
              private auth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.auth.user.subscribe(e => {
      this.userId = e?.uid;
    });
  }

  async importJsonFile(file: File) {

    console.log('Reading json file');
    let fileReader: FileReader = new FileReader();
    fileReader.onload = (e) => {
      this.samples = JSON.parse(fileReader.result!.toString());
    };
    fileReader.readAsText(file, 'UTF-8');
  }

  async readFile(files: FileList | null) {
    if ((files?.length ?? 0) == 0) {
      return;
    }

    let file = files!.item(0)!;
    if (file.name.endsWith('.json')) {
      await this.importJsonFile(file);
      return;
    }

    console.log(file);
    let fileReader: FileReader = new FileReader();
    fileReader.onload = (e) => {
      for (let line of fileReader.result!.toString().split('\n')) {
        try {
          let columns = line.split(';');
          if (columns.length < 13) {
            continue;
          }
          if (columns[0] == 'ID') {
            continue;
          }
          let sample = new Sample();
          sample.sampleNumber = columns[1]; // Identifikation
          sample.mineral = columns[2];      // Mineral
          sample.location = columns[3] + '\n' + columns[4] + '\n' + columns[5]; // Fundort1-3
          sample.timeStamp = columns[6]; // Datum
          let valueStr = columns[7].replace('.', '').replace(',', '.');
          let value = parseFloat(valueStr);
          sample.value = isNaN(value) ? 0 : value; // Wert
          sample.origin = columns[8]; // woher
          sample.size = columns[9]; // Größe
          sample.annotation = columns[11]; // Bemerkung
          //sample.printed = Date(columns[12]); // Gedruckt
          sample.sideMineral = columns[13]; // Begeleitmineral

          this.samples.push(sample);
        } catch (e) {
          console.log(e);
        }
      }
    };
    fileReader.readAsText(file, 'UTF-8');
  }

  async import(): Promise<void> {
    if (this.useRealTimeDatabase) {
      var jsonData = [];
      for (let sample of this.samples) {
        jsonData.push(sample.toDocumentData());
      }

      // this.database.database.ref(`users/${this.userId}/samples`).set(jsonData);
      localStorage.setItem('samples', JSON.stringify(jsonData));

      let uid = (await firstValueFrom(this.auth.user))?.uid;

      this.count = 0;
      for (let sample of this.samples) {
        await this.firebase.database.ref(`/users/${uid!}/samples`).push(sample);
        this.count++;
      }
      let maxSampleNumber = this.samples.sort((a, b) => {
        return b.sampleNumber.localeCompare(a.sampleNumber);
      })[0].sampleNumber;
      let number = (new RegExp('[0-9].')).exec(maxSampleNumber)?.pop();
      if (number) {
        let index = Number(number);
        await this.firebase.database.ref(`/users/${uid!}/index`).set(index);
      }
      this.router.navigate(['/samples/overview']);
      return;
    }

    for (let sample of this.samples) {
      const document = sample.toDocumentData();
      console.log(document);


      if (document != undefined) {
        sample.id = (await this.firestore.collection(CollectionNames.userCollection)
          .doc(this.userId).collection(CollectionNames.sampleCollection)
          .add(document)).id;
      }
    }
  }

  async deleteServerData() {
    await this.database.deleteServerData();
  }
}
