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

  public load_data: boolean = true;
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
  }

  ngOnInit() {
    this._title.setTitle('Perfil | Mis reservaciones');
    this.calcular_subtotal();
  }

  calcular_subtotal() {
    this.subtotal = (parseInt(this.horaFin!) - parseInt(this.horaInicio!)) * 10;
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
            this.load_btn = false;
            //this._router.navigate(['/usuario']);
          }
        }
    );
  }

}
