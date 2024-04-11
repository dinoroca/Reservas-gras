import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-index-res',
  templateUrl: './index-res.component.html',
  styleUrls: ['./index-res.component.css']
})


export class IndexResComponent implements OnInit {
  public user_lc: any = {};
  public empresa: any = {};
  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public exist_res = true;
  public filtro_cod = '';
  public err_msg = false;
  public filtro = false;
  public reservaciones: Array<any> = [];
  public reservacion: any = {};
  p: number = 1;

  public socket = io('http://localhost:4201');

  public exist_susc = true;
  public viewButton: boolean = false;
  public activePagos: boolean = false;
  public suscripciones: Array<any> = [];

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
    this._title.setTitle('GRASS | Mis reservaciones');
    this.socket.on('mostrar-reservas', () => {
      this.init_data();
    });
  }

  init_data() {

    this.load_data = true;

    this.filtro_cod = '';
    this.filtro = false;

    this._userService.obtener_empresa(this.id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error('Usuario inexistente', 'ERROR!');
          this.load_data = false;
          this.logout();
        } else {

          this.empresa = response.data;
          
          this._userService.obtener_reservaciones_empresa(this.empresa._id, this.token).subscribe(
            response => {
              if (response.data == undefined) {
                this.exist_res = false;
              } else {
                this.exist_res = true;
                this.reservaciones = response.data;
              }
            }
          );

          this._userService.obtener_suscripciones_empresa(this.empresa._id, this.token).subscribe(
            response => {
              if (response.data == undefined) {
                this.exist_susc = false;
                this.viewButton = true;
                this.activePagos = false;
              } else {
                this.exist_susc = true;
                this.suscripciones = response.data;

                for (let i = 0; i < this.suscripciones.length; i++) {
                  if (this.suscripciones[i].estado == 'Confirmado') {
                    this.activePagos = true;
                    this.viewButton = false;
                    break;
                  } else {
                    this.activePagos = false;
                  }
                }

                if (this.suscripciones.at(0).estado !== 'Confirmado') {
                  this.viewButton = true;
                  this.activePagos = false;
                }
              }
            }
          );
          
          this.load_data = false;
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
      this._userService.obtener_reservacion_empresa(this.filtro_cod, this.token).subscribe(
        response => {
          if (response.data != undefined) {
            this.err_msg = false;
            this.reservacion = response.data;
            this.filtro = true;
          } else {
            this.err_msg = true;
            this.init_data();
            this.reservacion = {};
          }
        }
      );
    } 
  }

  eliminar_reservacion(id: any) {
    this.load_btn = true;
    this._userService.eliminar_reservacion_empresa(id, this.token).subscribe(
      response => {
        this._toastrService.success('Se eliminó con éxito', 'ELIMINADO!');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

  confirmar_reservacion(id: any) {
    this.load_btn = true;
    this._userService.actualizar_reserva_reservado_empresa(id, this.token).subscribe(
      response => {
        this._toastrService.success('Se confirmó con éxito', 'ACTUALIZADO!');
        this.socket.emit('confirmar-reserva-admin', {data: true});
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

