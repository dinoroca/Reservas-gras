import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-index-canchas',
  templateUrl: './index-canchas.component.html',
  styleUrls: ['./index-canchas.component.css']
})

export class IndexCanchasComponent implements OnInit {

  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public load_btn_crear = false;
  public btn_crear = false;
  public canchas : any = [];

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Canchas');
  }

  init_data() {
    this._userService.obtener_canchas_empresa(this.id, this.token).subscribe(
      response => {
        this.load_data = true;
        if (response.data == undefined) {
          this.load_data = false;
          this.btn_crear = true;
          
        } else if(response.data != undefined) {
          this.btn_crear = false;
          this.canchas = response.data;
          this.load_data = false;
        }
      }
    );
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._userService.eliminar_cancha_empresa(id, this.token).subscribe(
      response => {
        this._toastrService.success('Se eliminó con éxito', 'ELIMINADO!');

        this.load_btn = false;
        this.init_data();
      }
    );
  }
}

