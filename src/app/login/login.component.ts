import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AngularFireAuth) {
  }

  ngOnInit(): void {
  }

  async login(username: string, password: string) {
    console.log('Login...')
    let result = await this.auth.signInWithEmailAndPassword(username, password);
    console.log(result.user)
    const token = await result.user?.getIdToken();
    localStorage.setItem('firebase', token ?? '')
  }
}
