import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-ver-grass',
  templateUrl: './ver-grass.component.html',
  styleUrls: ['./../home/home.component.css']
})

export class VerGrassComponent implements OnInit {

  public id: any;
  public url: any;
  public load_data = false;
  public load_btn = false;
  public load_btn_crear = false;
  public btn_crear = false;
  public canchas: any = [];
  public empresa: any = {};

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _title: Title
  ) {

    this.url = GLOBAL.url;
    const ruta = _router.url.split('/');

    this.id = ruta[ruta.length - 1];
    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('Ver Canchas');
  }

  init_data() {
    this.load_data = true;

    this._userService.obtener_empresa_publico(this.id).subscribe(
      response => {
        if (response.data == undefined) {

        } else {
          this.empresa = response.data;

          this._userService.obtener_canchas(this.id).subscribe(
            response => {
              if (response.data == undefined) {
                this.load_data = false;
                this.btn_crear = true;

              } else if (response.data != undefined) {
                this.btn_crear = false;
                this.canchas = response.data;
                this.load_data = false;
              }
            }
          );
        }
      }
    );
  }

  select_cancha(id: any) {
    localStorage.setItem('id_cancha', id);
    this._router.navigate(['/login']);
  }
}

