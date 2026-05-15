import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
//services
import { AuthService } from '../auth.service';


@Injectable({
  providedIn: 'root'
})
export class StoryGuard implements CanActivate {

  constructor(private authService: AuthService, private _router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        
    if (this.authService.isLogged && !this.authService.story) {
      this._router.navigate(['/']);
    }
    return true;
  }
}
