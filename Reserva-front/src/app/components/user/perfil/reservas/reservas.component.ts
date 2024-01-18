import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  public pagos: Array<any> = [];
  public cuentas: Array<any> = [];
  public reservaciones: Array<any> = [];

  public load_data: boolean = true;
  public load_reservas: boolean = true;
  public load_btn = false;
  public activePagos: boolean = false;
  public viewButton: boolean = false;

  public empresa = '';
  public token: any;
  public cancha: any = {};
  public user_lc: any = {};
  public afuera: any = {};
  public idCancha: any;
  public cliente: any;
  public subtotal: number = 0;
  public fecha;
  public horaInicio;
  public horaFin;
  public descuento = '';
  public fromOut: boolean = false;
  public existReservas: boolean = false;
  public myAngularxQrCode: string = '';
  p: number = 1;

  constructor(
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

    this.idCancha = localStorage.getItem('id_cancha');
    this.fecha = localStorage.getItem('fecha_reserva');
    this.horaInicio = localStorage.getItem('hora_inicio');
    this.horaFin = localStorage.getItem('hora_fin');
    this.afuera = localStorage.getItem('afuera');
    this.cliente = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

    this.myAngularxQrCode = 'Esto ';

    if (this.afuera === 'Y') {
      this.fromOut = true;
    } else {
      this.fromOut = false;
    }

    _userService.obtener_cancha_publico(this.idCancha).subscribe(
      response => {
        this.cancha = response.data;
        this.load_data = false;
      }
    );

    _userService.obtener_cuentas(this.token).subscribe(
      response => {
        this.cuentas = response.data;
      }
    );
  }

  ngOnInit() {
    this._title.setTitle('Perfil | Mis reservaciones');
    this.calcular_subtotal();
    this.obtener_reservas();

    if (this.reservaciones.length >= 1) {
      this.existReservas = true;
    } else {
      this.existReservas = false;
    }
  }

  calcular_subtotal() {
    this.subtotal = (parseInt(this.horaFin!) - parseInt(this.horaInicio!)) * 10;
  }

  obtener_reservas() {
    this.load_reservas = true;
    this._userService.obtener_reservaciones_user(this.cliente, this.token).subscribe(
      response => {
        if (response === undefined) {
          this.reservaciones = [];
        } else {
          this.reservaciones = response.data;
          this.load_reservas = false;
        }
      }
    );
  }

  crear_reservacion() {

    this.load_btn = true;

    let data = {
      empresa: this.cancha.empresa._id,
      cancha: this.idCancha,
      cliente: this.cliente,
      subtotal: this.subtotal,
      fecha: this.fecha,
      hora_inicio: this.horaInicio,
      hora_fin: this.horaFin
    }

    this._userService.crear_reservacion_user(data, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error(response.message, 'ERROR');
        } else {
          this._toastrService.success('Se reservó con éxito', 'RESERVADO!');
          localStorage.removeItem('afuera');
          localStorage.removeItem('fecha_reserva');
          localStorage.removeItem('hora_inicio');
          localStorage.removeItem('hora_fin');
          localStorage.removeItem('id_cancha');
          this.load_btn = false;
          window.location.reload();
          //this._router.navigate(['/usuario']);
        }
      }
    );
  }

  eliminar_pre_reserva() {
    localStorage.removeItem('afuera');
    localStorage.removeItem('fecha_reserva');
    localStorage.removeItem('hora_inicio');
    localStorage.removeItem('hora_fin');
    localStorage.removeItem('id_cancha');

    window.location.reload();
  }

}
