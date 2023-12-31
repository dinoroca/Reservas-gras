import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { UserService } from 'src/app/services/user.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-ver-grass',
  templateUrl: './ver-grass.component.html',
  styleUrls: ['./../home/home.component.css']
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
  screenWidth: number = 0;
  screenHeight: number = 0;
  public calendarOptions: CalendarOptions|undefined;

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

    this.calendarOptions= {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin]
    };
  }

  ngOnInit(): void {
    this._title.setTitle('Ver Canchas');
  }

  init_data() {
    this.load_data = true;

    this._userService.obtener_empresa_publico(this.id).subscribe(
      response => {
        if (response.data == undefined) {

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

