import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGrassGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private _router: Router
  ){}

  canActivate(): any {
    if(!this._userService.isAutenticatedGrass()){
      this._router.navigate(['/login']);
      return false;
    }
    return true;
  }
  
}
