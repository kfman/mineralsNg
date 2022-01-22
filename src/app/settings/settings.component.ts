import {Component, OnInit} from '@angular/core';
import {PdfCreatorService} from '../services/pdf-creator.service';
import {ToastService} from '../services/toast-service.service';
import {NumberingService} from '../services/numbering.service';
import {MineralDatabaseService} from '../services/mineral-database.service';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {firstValueFrom} from 'rxjs';
import {UserData} from '../models/UserData';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  numbers: string[] | undefined;
  patternError = false;
  loaded = false;

  userData = new UserData();
  indexError: boolean = false;
  showSetPasswordDialog = false;
  passwordMismatch = false;

  constructor(private pdfService: PdfCreatorService,
              private toastService: ToastService,
              private auth: AngularFireAuth,
              private database: MineralDatabaseService,
              private numberService: NumberingService) {
  }

  async ngOnInit(): Promise<void> {
    this.userData = await this.database.getUserData();
    this.loaded = true;
  }

  createPdf() {
    this.pdfService.printerSetupPage();
  }

  testToast() {
    this.toastService.show('This is a toast...', {
      classname: 'bg-success text-light',
      delay: 10000
    });
    console.log('Showing');
  }

  testNumbers() {
    try {
      this.numberService.getNumber(this.userData.pattern, 0);
      this.patternError = false;
    } catch (e) {
      this.patternError = true;
      this.toastService.show('Pattern ungültig',
        {classname: 'bg-danger text-light', delay: 15000});
    }
  }

  async testDbLoad() {
    let temp = await this.database.getAll(true);
    console.log(temp);
  }

  async savePattern() {
    await this.database.updateUser({'pattern': this.userData.pattern});
  }

  async saveName() {
    await this.database.updateUser({'name': this.userData.name});
  }

  async saveIndex() {
    await this.database.updateUser({'index': this.userData.index});
  }

  async setPassword(password: string, passwordRpt: string) {
    if (password != passwordRpt) {
      this.passwordMismatch = true;
      return;
    }

    try {
      let user = await firstValueFrom(this.auth.user);
      await user?.updatePassword(password);
      this.showSetPasswordDialog = false;
    } catch (e) {
      console.log(e);
    }
  }

  public progress = 0;
  async resetPrintedDate() {


    let samples = await this.database.getAll();
    var count = 0;
    for (let item of samples) {
      item.printed = null;
      await this.database.update(item.id!, item);
      count++;
      this.progress = count / samples.length * 100;
    }


    this.toastService.show(`Fertig (${count})`, {
      classname: 'bg-danger'
    });
  }
}
