import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public user_lc: any = {};
  public empresa: any = {};
  public token: any;
  public id: any;
  public load_data = false;

  public showModalChar = false;

  constructor(
    private _router: Router,
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {

    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    _userService.obtener_caracteristicas_empresa(this.id, this.token).subscribe(
      response => {
        this.load_data = true;
        if (response.data == undefined) {
          this.showModalChar = true;
          this.load_data = false;
        } else {
          this.showModalChar = false;
          this.load_data = false;
        }
      }

    );
  }

  openModal(): void {
    
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Inicio');
  }

}
