import {Component, OnInit} from '@angular/core';
import {AuthModule} from '@angular/fire/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  public isLoggedOn: boolean = false;

  constructor(private auth: AngularFireAuth,
  private router: Router) {
    this.auth.authState.subscribe(v => {
      this.isLoggedOn = v?.email != null;
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/'])
  }
}
