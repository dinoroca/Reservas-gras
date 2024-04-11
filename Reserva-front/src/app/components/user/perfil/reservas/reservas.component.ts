import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import html2canvas from 'html2canvas';
import { io } from 'socket.io-client';

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
  public load_cuentas = false;
  public descargando = false;
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

  public socket = io('http://localhost:4201');

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
  }

  ngOnInit() {
    this._title.setTitle('Perfil | Mis reservaciones');
    this.calcular_subtotal();
    this.obtener_reservas();

    this.socket.on('mostrar-reservas-user', () => {
      this.obtener_reservas();
      this.fromOut = false;
    });

    if (this.reservaciones.length >= 1) {
      this.existReservas = true;
    } else {
      this.existReservas = false;
    }
  }

  calcular_subtotal() {
    this.subtotal = (parseInt(this.horaFin!) - parseInt(this.horaInicio!)) * 10;
  }

  obtener_cuentas_grass(id: any) {
    this.load_cuentas = true;
    this._userService.obtener_cuentas_de_grass(id, this.token).subscribe(
      response => {
        this.cuentas = response.data;
        this.load_cuentas = false;
      }
    );
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
          this.socket.emit('crear-reserva-ocupado-out', {data: true});
          localStorage.removeItem('afuera');
          localStorage.removeItem('fecha_reserva');
          localStorage.removeItem('hora_inicio');
          localStorage.removeItem('hora_fin');
          localStorage.removeItem('id_cancha');
          this.load_btn = false;
        }
      }
    );
  }

  captureAndSaveView(id: any) {
    this.descargando = true;
  
    const container = document.getElementById(id);
  
    if (container) {
      // Capturar el contenido del contenedor
      html2canvas(container).then(contentCanvas => {
        // Crear un nuevo canvas solo para el contenido capturado
        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = contentCanvas.width;
        combinedCanvas.height = contentCanvas.height;
  
        const ctx = combinedCanvas.getContext('2d')!;
  
        // Dibujar el contenido capturado
        ctx.drawImage(contentCanvas, 0, 0);
  
        // Obtener la imagen capturada como una URL
        const combinedImage = combinedCanvas.toDataURL('image/png');
  
        // Crear un elemento a para la descarga
        const downloadLink = document.createElement('a');
        downloadLink.href = combinedImage;
        downloadLink.download = 'reservacion_grass.png'; // Puedes cambiar el nombre del archivo si lo deseas
  
        // Simular el clic en el enlace
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        downloadLink.dispatchEvent(clickEvent);
  
        // Reiniciar la propiedad descargando después de la simulación del clic
        this.descargando = false;
      });
    } else {
      // Si no se encuentra el contenedor, también debes reiniciar la propiedad descargando
      this.descargando = false;
    }
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
