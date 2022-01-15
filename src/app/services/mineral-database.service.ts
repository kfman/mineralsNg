import {Injectable} from '@angular/core';
import {Sample} from '../models/Sample';
import {NumberingService} from './numbering.service';

@Injectable({
  providedIn: 'root'
})
export class MineralDatabaseService {

  readonly #collectionName = 'samples';

  constructor(private numbering: NumberingService) {
  }


  async getSampleNumber(): Promise<string> {
    let all = await this.getAll();
    let lastIndex = Number(all[0].sampleNumber.split(' ')[1]);

    return this.numbering.getNumber('CR 00000', lastIndex + 1);
  }

  async getAll(): Promise<Sample[]> {
    let result = [];
    let json = JSON.parse(localStorage.getItem(this.#collectionName)!);
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
    await localStorage.setItem(this.#collectionName, JSON.stringify(dataset));
  }

}
