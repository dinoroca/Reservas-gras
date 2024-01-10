import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { concat } from 'rxjs';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

interface BotonHora {
  estado: string;
  fecha: Date;
  hora: string;
  disponible: boolean;
  id: string;
  // Otras propiedades según sea necesario
}

@Component({
  selector: 'app-ver-grass',
  templateUrl: './ver-grass.component.html',
  styleUrls: ['./../home/home.component.css', './ver-grass.component.css']
})

export class VerGrassComponent implements OnInit {
  public id: any;
  public url: any;
  public load_data = false;
  public load_btn = false;
  public load_btn_ver = false;
  public load_btn_crear = false;
  public width_view = true;
  public btn_crear = false;
  public ver_caracteristicas = false;
  public canchas: any = [];
  public cancha_ver: any = {};
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
    private _title: Title
  ) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    if (this.screenWidth >= this.screenHeight) {
      this.width_view = true;
    } else {
      this.width_view = false;
    }

    this.url = GLOBAL.url;
    const ruta = _router.url.split('/');
    this.id = ruta[ruta.length - 1];
    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('Ver Canchas');
    this.calcularDiasSemana();
    this.calcularIntervalosHorarios();
    this.inicializarBotonesHoras();
    this.horasReserva = 1;
  }

  private calcularDiasSemana() {
    this.diasSemana = [];
    const hoy = new Date();
    const primerDia = new Date(hoy);
  
    for (let i = 0; i < 7; i++) {
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
  
    for (let i = primerDiaSemana; i < 7; i++) {
      const fila: BotonHora[] = [];
      for (let j = 5; j < 24; j++) {
        const inicio = j < 10 ? `0${j}:00` : `${j}:00`;
        const fecha = new Date(this.diasSemana[i].fecha);
        const hora = inicio;
        const est: string = ahora > fecha || (ahora.getDate() === fecha.getDate() && ahora.getHours() >= j) ? 'Pasado' : 'Libre';
        const disponible = ahora.getDate() < fecha.getDate() || (ahora.getDate() === fecha.getDate() && ahora.getHours() <= j);
  
        const id = `00${i}${j}`;
        const boton: BotonHora = { estado: est, fecha, hora, disponible, id };
        fila.push(boton);
      }
      this.botonesHoras.push(fila);
    }
  
    for (let i = 0; i < primerDiaSemana; i++) {
      const fila: BotonHora[] = [];
      for (let j = 5; j < 24; j++) {
        const inicio = j < 10 ? `0${j}:00` : `${j}:00`;
        const fecha = new Date(this.diasSemana[i].fecha);
        fecha.setDate(fecha.getDate() + 7);  // Agregar una semana a la fecha
        const hora = inicio;
        const est: string = 'Libre';
        const disponible = true;
  
        const id = `00${i}${j}`;
        const boton: BotonHora = { estado: est, fecha, hora, disponible, id };
        fila.push(boton);
      }
      this.botonesHoras.push(fila);
    }
  }
  
  onHoraSeleccionada(fila: number, columna: number) {
    const boton = this.botonesHoras[fila][columna];
    if (boton.disponible) {
      boton.estado = boton.estado === 'Libre' ? 'Reservado' : 'Libre';

      // Accede a la información de la fecha y hora
      const fechaFormateada = new Intl.DateTimeFormat('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(boton.fecha);

      localStorage.setItem('fecha_reserva', fechaFormateada);
      localStorage.setItem('hora_inicio', this.horasInicio.toString());
      localStorage.setItem('hora_fin', this.horasFinal.toString());
      this._router.navigate(['/login']);
    }
  }

  isHoraPasada(fecha: Date, hora: string): boolean {
    const ahora = new Date();
    const horaSeleccionada = new Date(fecha);
    horaSeleccionada.setHours(parseInt(hora.split(':')[0], 10), 0);

    return ahora > horaSeleccionada;
  }

  select_mas_una_hora (hora: string) {
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
    this.load_data = true;

    this._userService.obtener_empresa_publico(this.id).subscribe(
      response => {
        if (response.data == undefined) {
          // Manejo de datos indefinidos
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

  click_ver(id: any) {
    this.load_btn_ver = true;
    this.ver_caracteristicas = !this.ver_caracteristicas;

    this._userService.obtener_cancha_publico(id).subscribe(
      response => {
        if (response === undefined) {
          this.cancha_ver = undefined;
          this.load_btn_ver = false;
        } else {
          this.cancha_ver = response.data;
          this.load_btn_ver = false;
        }
      }
    );

    localStorage.setItem('id_cancha', id);
  }
}
