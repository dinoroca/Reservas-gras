
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private _router: Router
  ){}

  canActivate(): any {
    if(!this._userService.isAutenticatedAdmin()){
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
  
}

