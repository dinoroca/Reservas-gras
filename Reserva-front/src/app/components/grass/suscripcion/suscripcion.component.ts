import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-suscripcion',
  templateUrl: './suscripcion.component.html',
  styleUrls: ['./suscripcion.component.css']
})
export class SuscripcionComponent implements OnInit {

  public user_lc: any = {};
  public empresa: any = {};
  public token: any;
  public id: any;
  public load_data = false;
  public load_btn_reg = false;
  public exist_susc = true;
  public activePagos: boolean = false;
  public viewButton: boolean = true;

  public socket = io('http://localhost:4201');

  public suscripciones: Array<any> = [];
  public cuentas: Array<any> = [];

  constructor(
    private _router: Router,
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {
    
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    
    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Mi suscripción');
    this.socket.on('mostrar-suscripciones', () => {
      this.init_data();
    });
  }

  init_data() {
    this.load_data = true;
    this._userService.obtener_suscripciones_empresa(this.id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.exist_susc = false;
          this.load_data = false;
        } else {
          this.exist_susc = true;
          this.suscripciones = response.data;
          for (let i = 0; i < this.suscripciones.length; i++) {
            if (this.suscripciones[i].estado == 'Confirmado') {
              this.activePagos = true;
              break;
            } else {
              this.activePagos = false;
            }
          }

          for (let i = 0; i < this.suscripciones.length; i++) {
            if (this.suscripciones[i].estado == 'Reservado') {
              this.viewButton = false;
              break;
            }
          }
          this.load_data = false;
        }
      }
    );

    this._userService.obtener_cuentas_de_admin(this.token).subscribe(
      response => {
        this.cuentas = response.data;
        this.load_data = false;
      }
    );
    
  }

  registrar_prueba_gratis() {
    this.load_btn_reg = true;

    let data = {
      empresa: this.id,
      subtotal: 0,
      transaccion: 123
    }

    this._userService.registro_suscripcion_prueba(data, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error('No se pudo crear su suscripción', 'ERROR!');
          this.load_btn_reg = false;
        } else {
          this._toastrService.success('Se creó con éxito', 'CREADO!');
          this.load_btn_reg = false;
          this.init_data();
        }
      }
    );
  }

  registrar_suscripcion() {
    this.load_btn_reg = true;

    let data = {
      empresa: this.id,
      subtotal: 30,
      transaccion: 123
    }

    this._userService.registro_suscripcion_empresa(data, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error('No se pudo crear su suscripción', 'ERROR!');
          this.load_btn_reg = false;
        } else {
          this._toastrService.success('Se creó con éxito', 'CREADO!');
          this.load_btn_reg = false;
          this.viewButton = false;
          this.socket.emit('confirmar-suscripcion-admin', {data: true});
          this.init_data();
        }
      }
    );
  }

}
