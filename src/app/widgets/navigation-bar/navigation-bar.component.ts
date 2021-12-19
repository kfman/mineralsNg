import {Component, OnInit} from '@angular/core';
import {AuthModule} from '@angular/fire/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  public isLoggedOn: boolean = false;

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe(v => {
      this.isLoggedOn = v?.email != null;
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.auth.signOut();
  }
}
