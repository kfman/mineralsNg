import {Injectable} from '@angular/core';
import {Sample} from '../models/Sample';
import {NumberingService} from './numbering.service';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {firstValueFrom} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class MineralDatabaseService {

  readonly #collectionName = 'samples';
  readonly #lastChanged = 'lastChanged';
  private samples?: Sample[];

  async getUserId(): Promise<string | undefined> {
    return (await firstValueFrom(this.auth.user))?.uid;
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

    for (let [key, value] of Object.entries(sampleMap)) {
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

    let uid = await this.getUserId();
    let lastChanged = Number(await this.firebase.database.ref(`/users/${uid}/lastChanged`).get());
    if (lastChanged > Number(localStorage.getItem(this.#lastChanged))) {
      forceReload = true;
    }

    console.log('Loading data due to '
      + (forceReload ? 'forceReload ' : ' ')
      + ((this.samples == null) ? 'samples are null' : ''));


    var result: Sample[] = [];
    let localData = localStorage.getItem(this.#collectionName);

    if (!localData || forceReload) {
      console.log('Loading data from server');
      result = await this.loadFromServer();

      await this.save(result, lastChanged, true);
    } else {
      let json = JSON.parse(localData!);
      for (let item of json) {
        result.push(item);
      }
    }
    this.samples = result; //.sort((a: Sample, b: Sample) => b.sampleNumber.localeCompare(a.sampleNumber));
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

    let uid = await this.getUserId();
    await this.firebase.database.ref(`/users/${uid}/samples/${id}`).remove();
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

    console.log(sample);

    let lastChanged = Date.now();
    let uid = await this.getUserId();
    await this.firebase.database.ref(`/users/${uid}/samples/${id}`).set(sample);
    await this.firebase.database.ref(`/users/${uid}`).update({'lastChanged': lastChanged});
    await this.save(all, lastChanged);
  }

  async add(sample: Sample): Promise<string | null> {
    let all = await this.getAll();

    sample.id = sample.sampleNumber;
    let uid = await this.getUserId();
    let ref = await this.firebase.database.ref(`/users/${uid}/samples`).push(sample);
    await this.firebase.database.ref(`/users/${uid}`).update({'lastChanged': Date.now()});
    sample.id = ref.key!;

    all.push(sample);
    await this.save(all);
    return ref.key;
  }

  private async save(dataset: Sample[], lastChanged?: number, onlyLocal: boolean = false) {
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
    await localStorage.setItem(this.#lastChanged, (lastChanged ?? Date.now()).toString());

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

  async storeAsPrinted(samples: Sample[]) {
    let timeStamp = new Date();

    let uid = (await firstValueFrom(this.auth.user))?.uid;
    for (let sample of samples) {
      if (!sample.id) {
        continue;
      }
      let dbSample = await this.get(sample.id!);
      dbSample!.printed = timeStamp;
      await this.update(sample.id, dbSample!);
      await this.firebase.database.ref(`/users/${uid}/samples/${sample.id}`).update({'printed': timeStamp});
    }
    await localStorage.setItem(this.#lastChanged, (timeStamp.getTime() ?? Date.now()).toString());
    await this.firebase.database.ref(`/users/${uid}`).update({'lastChanged': timeStamp.getTime()});
  }

  async updateUser(values: Object) {
    let uid = await this.getUserId();
    await this.firebase.database.ref(`/users/${uid}`).update(values);
  }

  async getName() {
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    let data = await this.firebase.database.ref(`/users/${uid}/name`).get();
    return data.val();

  }

  async getIndex() {
    let uid = (await firstValueFrom(this.auth.user))?.uid;
    let data = await this.firebase.database.ref(`/users/${uid}/index`).get();
    return data.val();
  }
}
