import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-suscripciones',
  templateUrl: './suscripciones.component.html',
  styleUrls: ['./suscripciones.component.css']
})

export class SuscripcionesComponent implements OnInit {
  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public filtro_cod = '';
  public err_msg = false;
  public existr_susc = false;
  public filtro = false;
  public suscripciones: Array<any> = [];
  public suscripcion: any = {};
  p: number = 1;

  public socket = io('http://localhost:4201');

  constructor(
    private _router: Router,
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('ADMIN | suscripciones');
    this.socket.on('mostrar-suscripciones', () => {
      this.init_data();
    });
  }

  init_data() {
    this.load_data = true;
    this.filtro_cod = '';
    this.err_msg = false;
    this.filtro = false;
    this._userService.obtener_suscripciones_admin(this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.load_data = false;
          this.existr_susc = false;
        } else {
          this.suscripciones = response.data;
          this.load_data = false;
          this.existr_susc = true;
        }
      }
    );
  }

  filtrar_cod() {
    if (this.filtro_cod == '') {
      this.err_msg = false;
      this.filtro = false;
      this.init_data();
    } else {
      this._userService.obtener_suscripcion_admin(this.filtro_cod, this.token).subscribe(
        response => {
          if (response.data != undefined) {
            this.err_msg = false;
            this.suscripcion = response.data;
            this.filtro = true;
          } else {
            this.err_msg = true;
            this.init_data();
            this.suscripcion = {};
          }
        }
      );
    }
  }

  confirmar_suscripcion(id: any) {
    this.load_btn = true;
    this._userService.actualizar_suscripcion_confirmado_admin(id, this.token).subscribe(
      response => {
        this._toastrService.success('Se confirmó con éxito', 'ACTUALIZADO!');
        this.socket.emit('confirmar-suscripcion-admin', {data: true});
        this.load_btn = false;
        this.init_data();
      }
    );
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']);
  }
}



