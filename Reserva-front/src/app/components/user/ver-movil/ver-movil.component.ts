import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

interface BotonHora {
  estado: string;
  fecha: Date;
  hora: string;
  disponible: boolean;
  id: string;
}

@Component({
  selector: 'app-ver-movil',
  templateUrl: './ver-movil.component.html',
  styleUrls: [ './../inicio/inicio.component.css', './ver-movil.component.css']
})

export class VerMovilComponent implements OnInit {
  public id: any;
  public id_user: any;
  public token: any;
  public id_cancha: any;
  public user_lc: any;
  public url: any;
  public load_data = false;
  public load_btn = false;
  public load_btn_ver = false;
  public load_btn_crear = false;
  public width_view = true;
  public btn_crear = false;
  public ver_caracteristicas = false;
  public canchas: any = [];
  public reservaciones: any = [];
  public cancha: any = {};
  public empresa: any = {};
  public horasInicio: number = 0;
  public horasFinal: number = 0;
  public horasReserva: number = 1;
  public masDeUno: boolean = false;
  diasSemana: { nombre: string; fecha: Date }[] = [];
  intervalosHorarios: { inicio: string; fin: string }[] = [];
  botonesHoras: BotonHora[][] = [];
  fechaHoraSeleccionada: { fecha: Date; hora: string } | null = null;
  screenWidth: number = 0;
  screenHeight: number = 0;

  ahora: Date = new Date();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    if (this.screenWidth >= this.screenHeight) {
      this.width_view = true;
    } else {
      this.width_view = false;
    }

    this.id_user = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

    this.url = GLOBAL.url;
    const ruta = _router.url.split('/');
    this.id = ruta[ruta.length - 1];
    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('Ver Canchas');
    this.horasReserva = 1;
  }

  private calcularDiasSemana() {
    this.diasSemana = [];
    const hoy = new Date();
    const primerDia = new Date(hoy);

    for (let i = 0; i <= 7; i++) {
      const dia = new Date(primerDia);
      dia.setDate(primerDia.getDate() + i);
      this.diasSemana.push({ nombre: dia.toLocaleDateString('es-ES', { weekday: 'long' }).slice(0, 3), fecha: dia });
    }
  }

  private calcularIntervalosHorarios() {
    this.intervalosHorarios = [];
    for (let i = 5; i < 24; i++) {
      const inicio = i < 10 ? `0${i}:00` : `${i}:00`;
      const fin = (i + 1) < 10 ? `0${i + 1}:00` : `${i + 1}:00`;

      this.intervalosHorarios.push({ inicio, fin });
    }
  }

  private inicializarBotonesHoras() {
    const ahora = new Date();
    const primerDiaSemana = ahora.getDay();

    for (let i = primerDiaSemana; i <= primerDiaSemana + 7; i++) {
      const fila: BotonHora[] = [];
      for (let j = 5; j < 24; j++) {
        const inicio = j < 10 ? `${j}` : `${j}`;
        const fecha = new Date(ahora);
        fecha.setDate(ahora.getDate() + (i - primerDiaSemana));
        const hora = inicio;

        const esDiaActual = i === primerDiaSemana;
        const est: string = (esDiaActual && ahora.getHours() >= j) ? 'Pasado' : 'Libre';
        const disponible = esDiaActual ? ahora.getHours() < j : true;

        const id = `00${i}${j}`.slice(-4); // Asegurar que el ID tenga cuatro dígitos
        const boton: BotonHora = { estado: est, fecha, hora, disponible, id };
        fila.push(boton);
      }
      this.botonesHoras.push(fila);
    }
  }


  onHoraSeleccionada(filaIndex: number, columnaIndex: number) {
    const boton = this.botonesHoras[filaIndex][columnaIndex];

    if (boton.disponible) {
      
      let data = {
        empresa: this.cancha.empresa._id,
        cancha: this.cancha._id,
        cliente: this.id_user,
        subtotal: this.horasReserva * 10,
        fecha: boton.fecha.toDateString(),
        hora_inicio: this.horasInicio,
        hora_fin: this.horasFinal
      }

      this._userService.crear_reservacion_user(data, this.token).subscribe(
        response => {
          if (response.data == undefined) {
            this._toastrService.error(response.message, 'ERROR');
          } else {
            this._toastrService.success('Se reservó con éxito', 'RESERVADO!');
            this._router.navigate(['/usuario/perfil/reservas']);
          }
        }
      );
      
    }
  }

  isHoraPasada(fecha: Date, hora: string): boolean {
    const ahora = new Date();
    const horaSeleccionada = new Date(fecha);
    horaSeleccionada.setHours(parseInt(hora.split(':')[0], 10), 0);

    return ahora > horaSeleccionada;
  }

  select_mas_una_hora(hora: string) {
    if (this.horasReserva > 1) {
      this.horasInicio = parseInt(hora);
      this.horasFinal = this.horasInicio + this.horasReserva;
      this.masDeUno = true;
    } else {
      this.horasInicio = parseInt(hora);
      this.horasFinal = this.horasInicio + 1;
      this.masDeUno = false;
    }
  }

  reset_horas_reserva() {
    this.horasReserva = 1;
  }

  init_data() {
    this.botonesHoras = [];
    this.load_btn_ver = true;
    this.ver_caracteristicas = !this.ver_caracteristicas;

    this._userService.obtener_cancha_publico(this.id).subscribe(
      response => {
        if (response === undefined) {
          this.cancha = undefined;
        } else {
          this.cancha = response.data;

          this._userService.obtener_reservaciones_public(this.cancha._id).subscribe(
            response => {
              this.reservaciones = response.data;

              if (this.reservaciones.length >= 1) {
                const ahora = new Date();
                const primerDiaSemana = ahora.getDay();

                for (let i = primerDiaSemana; i <= primerDiaSemana + 7; i++) {
                  const fila: BotonHora[] = [];

                  for (let j = 5; j < 24; j++) {
                    const inicio = j < 10 ? `0${j}` : `${j}`;
                    const fecha = new Date(ahora);
                    fecha.setDate(ahora.getDate() + (i - primerDiaSemana));
                    const hora = inicio;

                    let estadoBoton = 'Libre';
                    let disponibleBtn = true;

                    for (let k = 0; k < this.reservaciones.length; k++) {
                      const reservacion = this.reservaciones[k];
                      const reservacionFecha = new Date(reservacion.fecha);
                      const reservacionHoraInicio = reservacion.hora_inicio;
                      const reservacionHoraFin = reservacion.hora_fin;

                      if (
                        fecha.getDate() === reservacionFecha.getDate() &&
                        fecha.getMonth() === reservacionFecha.getMonth() &&
                        fecha.getFullYear() === reservacionFecha.getFullYear() &&
                        parseInt(hora) >= parseInt(reservacionHoraInicio) &&
                        parseInt(hora) < parseInt(reservacionHoraFin)
                      ) {
                        estadoBoton = reservacion.estado;
                        disponibleBtn = false;
                        break;
                      }
                    }

                    const esDiaActual = i === primerDiaSemana;
                    const est: string = (esDiaActual && ahora.getHours() >= j) ? 'Pasado' : estadoBoton;
                    const disponible = esDiaActual ? ahora.getHours() < j : true;

                    if (!disponible) {
                      disponibleBtn = false;
                    }

                    const id = `00${i}${j}`.slice(-4); // Asegurar que el ID tenga cuatro dígitos
                    const boton: BotonHora = { estado: est, fecha, hora, disponible: disponibleBtn, id };
                    fila.push(boton);
                  }

                  this.botonesHoras.push(fila);
                }
              } else {
                this.inicializarBotonesHoras();

              }


            }
          );

          this.calcularDiasSemana();
          this.calcularIntervalosHorarios();
          this.load_btn_ver = false;
        }
      }
    );
  }

  click_reservar(id: any) {
    localStorage.setItem('id_cancha', id);
  }

  volverAtras() {
    window.history.back();
  }
}


