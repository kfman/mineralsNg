import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Router} from '@angular/router';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  showAlert = false;
  alertMessage = '';

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  async signup(username: string, password: string) {
    try {
      const result = await this.auth.createUserWithEmailAndPassword(username, password);
      this.router.navigate(['/samples/overview']);
    } catch (e) {
      this.showAlert = true;
      this.alertMessage = (e as FirebaseError)?.message ?? "Fehler unbekannt";

      setTimeout(() => {
        this.showAlert = false;
      }, 8000);
    }
  }
}
