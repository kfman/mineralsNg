import {Injectable} from '@angular/core';
import {Sample} from '../models/Sample';

@Injectable({
  providedIn: 'root'
})
export class MineralDatabaseService {

  private uid: string;
  readonly #collectionName= 'samples';

  constructor(uid: string) {
    this.uid = uid;
  }

  async getAll(): Promise<Sample[]> {
    var result = [];
    let json = JSON.parse(localStorage.getItem(this.#collectionName)!);
    for (let item of json){
      result.push(Sample.fromDocument(item));
    }
    return result;
  }

  async get(id: string): Promise<Sample | null> {
    return null;
  }

  async delete(id: string){

  }

  async update(id: string, sample:Sample){

  }

  async add(sample:Sample){

  }

}
