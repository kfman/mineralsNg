import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {EditSampleComponent} from '../samples/edit-sample/edit-sample.component';
import {MineralDatabaseService} from '../services/mineral-database.service';

@Injectable({
  providedIn: 'root'
})
export class LeaveEditPageGuard implements CanDeactivate<EditSampleComponent> {

  constructor(private database: MineralDatabaseService) {
  }

  async canDeactivate(
    component: EditSampleComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Promise<boolean | UrlTree> {
    console.log('Leaving edit page...')

    // Save component
    if (component.deleted || !component.sample?.mineral) {
      return true;
    }

    if (component.sample) {
      if (component.id == 'new') {
        component.id = (await this.database.add(component.sample))!;
        let index = (await this.database.getUserData()).index;
        await this.database.updateUser({'index': ++index});
      } else {
        await this.database.update(component.id, component.sample);
      }
    }

    return true;
  }

}
