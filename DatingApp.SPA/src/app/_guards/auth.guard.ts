import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authServise:AuthService,
    private router:Router,
    private alertifyService:AlertifyService){}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if(this.authServise.loggedIn()){
      return true;
    }
    this.alertifyService.error('You need to be logged in to access this area.');
    this.router.navigate(['/home']);
    return false;
  }
}
