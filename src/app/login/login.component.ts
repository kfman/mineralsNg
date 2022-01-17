import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;
import {MineralDatabaseService} from '../services/mineral-database.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  showAlert = false;
  alertMessage = '';

  constructor(private auth: AngularFireAuth,
              private router: Router,
              private database: MineralDatabaseService) {
  }

  ngOnInit(): void {
  }

  async login(username: string, password: string) {
    try {
      let result = await this.auth.signInWithEmailAndPassword(username, password);
      if (result.user != null) {
        const token = await result.user?.getIdToken();
        await this.database.getAll(true);
        localStorage.setItem('name', await this.database.getName());
        this.router.navigate(['/samples/overview']);
      } else {

        this.showAlert = true;
      }
    } catch (e) {
      this.showAlert = true;
      this.alertMessage = (e as FirebaseError)?.message ?? 'Fehler unbekannt';
      setTimeout(() => {
        this.showAlert = false;
      }, 8000);
    }

  }
}
