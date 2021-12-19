import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {LoginComponent} from './login/login.component';
import {RouterModule} from '@angular/router';
import { NavigationBarComponent } from './widgets/navigation-bar/navigation-bar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationBarComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [{path: '', component: LoginComponent},
        {path:'signup', component: SignUpComponent}],
    ),
    NgbModule,

  ],
  providers: [
    AngularFireAuth,
    AngularFireDatabase,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
