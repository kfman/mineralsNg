import {Injectable} from '@angular/core';
import {Sample} from '../models/Sample';
import {NumberingService} from './numbering.service';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';
import {CollectionNames} from '../system-constants';
import {AngularFireDatabase} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class MineralDatabaseService {

  readonly #collectionName = 'samples';

  constructor(private numbering: NumberingService,
              private auth: AngularFireAuth,
              private firebase: AngularFireDatabase,
              private router: Router,
  ) {
  }


  async getSampleNumber(): Promise<string> {
    let all = await this.getAll();
    let lastIndex = Number(all[0].sampleNumber.split(' ')[1]);

    let uid = (await firstValueFrom(this.auth.user))?.uid;
    await this.firebase.database.ref(`/users/${uid}`).update({
      'pattern': 'CR 00000',
      'index': lastIndex
    });
    return this.numbering.getNumber('CR 00000', lastIndex + 1);
  }

  async getAll(): Promise<Sample[]> {
    let localData = localStorage.getItem(this.#collectionName);
    if (localData == null) {
      let uid = (await firstValueFrom(this.auth.user))?.uid;
      if (!uid) {
        this.router.navigate(['/login']);
      }
      await this.firebase.database.ref(`/users/${uid}/samples`).get();
    }
    let result = [];
    let json = JSON.parse(localData!);
    for (let item of json) {
      result.push(item);
    }
    return result.sort((a: Sample, b: Sample) => b.sampleNumber.localeCompare(a.sampleNumber));

  }

  async get(id: string): Promise<Sample | undefined> {
    let all = await this.getAll();
    return all.find(s => s.id == id);
  }

  async delete(id: string) {
    let all = await this.getAll();
    all.forEach((element, index) => {
      if (element.id == id) {
        all.splice(index, 1);
      }
    });

    this.save(all);
  }

  async update(id: string, sample: Sample) {
    let all = await this.getAll();

    all.forEach((element, index) => {
      if (element.id == id) {
        all.splice(index, 1);
      }
    });

    sample.id = id;
    all.push(sample);
    await this.save(all);
  }

  async add(sample: Sample): Promise<string> {
    sample.id = sample.sampleNumber;
    let all = await this.getAll();
    all.push(sample);
    await this.save(all);
    return sample.id;
  }

  private async save(dataset: Sample[]) {
    let dbDump = JSON.stringify(dataset);
    await localStorage.setItem(this.#collectionName, dbDump);
    console.log(`Stored ${Math.round(dbDump.length / 1024)} kB locally`);
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    if (!uid) {
      this.router.navigate(['/login']);
      console.log('Not logged in');
    }
    await this.firebase.database.ref(`/users/${uid}/samples`).set(dataset);

  }

  public async deleteServerData() {
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    await this.firebase.database.ref(`/users/${uid}/samples`).set({});
  }

  async updatePattern(numbering: string) {
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    await this.firebase.database.ref(`/users/${uid}`).update({'pattern': numbering});
  }

  async getPattern(): Promise<string>{
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    let data =  await this.firebase.database.ref(`/users/${uid}/pattern`).get();
  return data.val();
  }
}
