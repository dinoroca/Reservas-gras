import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';

interface BotonHora {
  estado: string;
  fecha: Date;
  hora: string;
  disponible: boolean;
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
  }

  private calcularDiasSemana() {
    const hoy = new Date();
    const primerDiaSemana = hoy.getDay();
    const primerDia = new Date(hoy.setDate(primerDiaSemana));

    for (let i = 0; i <= 7; i++) {
      const dia = new Date(primerDia);
      dia.setDate(primerDia.getDate() + i);
      this.diasSemana.push({ nombre: dia.toLocaleDateString('es-ES', { weekday: 'long' }).slice(0, 3), fecha: dia });
    }
  }

  private calcularIntervalosHorarios() {
    for (let i = 5; i < 24; i++) {
      const inicio = i < 10 ? `0${i}:00` : `${i}:00`;
      const fin = (i + 1) < 10 ? `0${i + 1}:00` : `${i + 1}:00`;

      this.intervalosHorarios.push({ inicio, fin });
    }
  }

  private inicializarBotonesHoras() {
    for (let i = 0; i <= 7; i++) {
      const fila: BotonHora[] = [];
      for (let j = 5; j < 24; j++) {
        const inicio = j < 10 ? `0${j}:00` : `${j}:00`;
        const fecha = new Date(this.diasSemana[i].fecha);
        const hora = inicio;
        const disponible = !this.isHoraPasada(fecha, inicio); // Establecer disponibilidad según la lógica necesaria
        const boton: BotonHora = { estado: 'libre', fecha, hora, disponible };
        fila.push(boton);
      }
      this.botonesHoras.push(fila);
    }
  }

  onHoraSeleccionada(fila: number, columna: number) {
    const boton = this.botonesHoras[fila][columna];
    if (boton.disponible) {
      boton.estado = boton.estado === 'libre' ? 'reservado' : 'libre';

      // Accede a la información de la fecha y hora
      const fechaFormateada = new Intl.DateTimeFormat('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(boton.fecha);
      console.log(fechaFormateada, boton.hora);
    }
  }

  isHoraPasada(fecha: Date, hora: string): boolean {
    const ahora = new Date();
    const horaSeleccionada = new Date(fecha);
    horaSeleccionada.setHours(parseInt(hora.split(':')[0], 10), 0);

    return ahora > horaSeleccionada;
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
  }

  select_cancha(id: any) {
    localStorage.setItem('id_cancha', id);
    this._router.navigate(['/login']);
  }
}
