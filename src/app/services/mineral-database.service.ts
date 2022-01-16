import {Injectable} from '@angular/core';
import {Sample} from '../models/Sample';
import {NumberingService} from './numbering.service';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {firstValueFrom, sample} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class MineralDatabaseService {

  readonly #collectionName = 'samples';
  private samples?: Sample[];
  private uid?: string;

  async getUserId(): Promise<string | undefined> {
    if (this.uid == null) {
      this.uid = (await firstValueFrom(this.auth.user))?.uid;
    }
    return this.uid;
  }

  constructor(private numbering: NumberingService,
              private auth: AngularFireAuth,
              private firebase: AngularFireDatabase,
              private router: Router,
  ) {
  }


  async getSampleNumber(): Promise<string> {
    let uid = await this.getUserId();
    let pattern = (await this.firebase.database.ref(`/users/${uid}/pattern`).get()).val() as string;
    let lastIndex = (await this.firebase.database.ref(`/users/${uid}/index`).get()).val() as number;
    return this.numbering.getNumber(pattern, lastIndex + 1);
  }

  private async loadFromServer(): Promise<Sample[]> {
    let uid = (await this.getUserId());
    let data = await this.firebase.database.ref(`/users/${uid}/samples`).get();
    let sampleMap = data.val() as Map<string, Sample>;
    let result: Sample[] = [];

    for (let [key, value] of Object.entries(sampleMap)){
      let sample = value;
      sample.id = key;
      result.push(sample);
    }
    return result;
  }

  async getAll(forceReload = false): Promise<Sample[]> {
    if (this.samples && !forceReload) {
      return this.samples;
    }

    var result: Sample[] = [];
    let localData = localStorage.getItem(this.#collectionName);
    if (!localData || forceReload) {
      console.log('Loading data from server');
      result = await this.loadFromServer();
      await this.save(result, true);
    } else {
      let json = JSON.parse(localData!);
      for (let item of json) {
        result.push(item);
      }
    }
    this.samples = result.sort((a: Sample, b: Sample) => b.sampleNumber.localeCompare(a.sampleNumber));
    return this.samples;
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

  private async save(dataset: Sample[], onlyLocal: boolean = false) {
    let dbDump = JSON.stringify(dataset);
    await localStorage.setItem(this.#collectionName, dbDump);
    console.log(`Stored ${Math.round(dbDump.length / 1024)} kB locally`);

    if (onlyLocal) {
      return;
    }

    let uid = (await firstValueFrom(this.auth.user))?.uid;
    if (!uid) {
      this.router.navigate(['/login']);
      console.log('Not logged in');
    }
    // await this.firebase.database.ref(`/users/${uid}/samples`).set(dataset);

  }

  public async deleteServerData() {
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    await this.firebase.database.ref(`/users/${uid}/samples`).set({});
  }

  async updatePattern(numbering: string) {
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    await this.firebase.database.ref(`/users/${uid}`).update({'pattern': numbering});
  }

  async getPattern(): Promise<string> {
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    let data = await this.firebase.database.ref(`/users/${uid}/pattern`).get();
    return data.val();
  }
}
