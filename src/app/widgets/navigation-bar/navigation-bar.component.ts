import {Component, OnInit} from '@angular/core';
import {AuthModule} from '@angular/fire/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {Router} from '@angular/router';
import {MineralDatabaseService} from '../../services/mineral-database.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  public isLoggedOn: boolean = false;

  public get name() {
    return localStorage.getItem('name');
  };

  constructor(private auth: AngularFireAuth,
              private database: MineralDatabaseService,
              private router: Router) {
    this.auth.authState.subscribe(v => {
      this.isLoggedOn = v?.email != null;
    });
  }

  async ngOnInit(): Promise<void> {

  }

  async logout() {
    await this.auth.signOut();
    localStorage.clear();
    await this.router.navigate(['/']);
  }
}
