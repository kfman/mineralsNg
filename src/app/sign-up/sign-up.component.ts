import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private auth: AngularFireAuth, private firestore: AngularFirestore) { }

  ngOnInit(): void {
  }

  async signup(username: string, password: string) {
    const result = await this.auth.createUserWithEmailAndPassword(username, password);
  }
}
