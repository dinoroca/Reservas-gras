import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { GLOBAL } from '../../../services/global';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token: any;
  public id: any;
  public user: any = undefined;
  public user_lc: any = {};
  public url;

  constructor(
    private _userService: UserService,
    private _router: Router
  ) {
    
    this.url = GLOBAL.url;
    this.user_lc = undefined;

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    if (this.token) {
      //Obtener usuario
      this._userService.obtener_empresa(this.id, this.token).subscribe(
        response => {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));

          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

          } else {
            this.user_lc = undefined;
          }
        }
      );
    }
  }

  ngOnInit(): void {
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/login']);
  }

}
