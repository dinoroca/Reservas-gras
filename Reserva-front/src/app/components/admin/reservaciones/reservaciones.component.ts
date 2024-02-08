import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-reservaciones',
  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css']
})

export class ReservacionesComponent implements OnInit {
  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public load_car = true;
  public load_cuentas = true;
  public exist_res = true;
  public reservaciones: Array<any> = [];
  public cuentas: Array<any> = [];
  public caracteristicas: any;
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
    this._title.setTitle('ADMIN | Reservaciones');
    this.socket.on('mostrar-reservas', () => {
      this.init_data();
    });
  }

  init_data() {
    this.load_data = true;
    this._userService.obtener_reservaciones_admin(this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.exist_res = false;
          this.load_data = false;
        } else {
          this.reservaciones = response.data;
          this.exist_res = true;
          this.load_data = false;
        }
      }
    );
  }

  obtener_caracteristicas(id: any) {
    this.load_car = true;
    this.load_cuentas = true;
    this._userService.obtener_caracteristicas_admin(id, this.token).subscribe(
      response => {
        this.caracteristicas = response.data[0];
        this.load_car = false;
      }
    );

    this._userService.obtener_cuentas_de_empresa_admin(id, this.token).subscribe(
      response => {
        this.cuentas = response.data;
        this.load_cuentas = false;
      }
    );
  }

  confirmar_reservacion(id: any) {
    this.load_btn = true;
    this._userService.actualizar_reserva_reservado_admin(id, this.token).subscribe(
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


