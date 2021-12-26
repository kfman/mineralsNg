import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFireDatabase} from '@angular/fire/compat/database';
import {LoginComponent} from './login/login.component';
import {RouterModule} from '@angular/router';
import {
  NavigationBarComponent
} from './widgets/navigation-bar/navigation-bar.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SignUpComponent} from './sign-up/sign-up.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {AngularFireModule} from '@angular/fire/compat';
import * as secrets from './firebaseConfig.json';
import {AngularFireAuthGuard} from '@angular/fire/compat/auth-guard';
import {EditSampleComponent} from './samples/edit-sample/edit-sample.component';
import {InputsModule} from '@progress/kendo-angular-inputs';
import {LabelModule} from '@progress/kendo-angular-label';
import {GridModule} from '@progress/kendo-angular-grid';
import {OverviewComponent} from './samples/overview/overview.component';
import {ImportCsvComponent} from './samples/import-csv/import-csv.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavigationBarComponent,
    SignUpComponent,
    OverviewComponent,
    EditSampleComponent,
    ImportCsvComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {path: '', component: LoginComponent},
        {path: 'signup', component: SignUpComponent},
        {
          path: 'samples/overview',
          component: OverviewComponent,
          canActivate: [AngularFireAuthGuard]
        },
        {
          path: 'samples/import',
          component: ImportCsvComponent,
          canActivate: [AngularFireAuthGuard]
        },
        {
          path: 'samples/:id',
          component: EditSampleComponent,
          canActivate: [AngularFireAuthGuard]
        },
      ],
    ),
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AngularFireModule.initializeApp(secrets),
    InputsModule,
    LabelModule,
    GridModule,
  ],
  providers: [
    AngularFireAuth,
    AngularFireDatabase,

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
