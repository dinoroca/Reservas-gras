import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-create-canchas',
  templateUrl: './create-canchas.component.html',
  styleUrls: ['./create-canchas.component.css']
})

export class CreateCanchasComponent implements OnInit {

  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public load_btn_crear = false;
  public btn_crear = false;
  public btn_actualzar = false;
  public field_extra = false;
  public procede = false;
  public cancha: any = {
    tipo: '',
    largo: 0,
    ancho: 0,
    precio_dia: 0,
    precio_noche: 0
  };
  public empresa: any = {};
  public data: any = {};

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Canchas');
  }

  init_data() {
    this._userService.obtener_empresa(this.id, this.token).subscribe(
      response => {
        this.load_data = true;
        if (response.data == undefined) {
          this._toastrService.error('Usuario inexistente', 'ERROR!');
          this.load_data = false;
          this.logout();
        } else {
          this.empresa = response.data;
          this.load_data = false;
        }
      }
    );
  }

  select_tipo() {
    if (this.cancha.tipo == 'Mixto') {
      this.field_extra = true;
    } else {
      this.field_extra = false;
    }
  }

  crear() {
    this.load_btn_crear = true;
    this.data = {
      empresa: this.id,
      descripcion: this.cancha.descripcion,
      tipo: this.cancha.tipo,
      largo: this.cancha.largo,
      ancho: this.cancha.ancho,
      precio_dia: this.cancha.precio_dia,
      precio_noche: this.cancha.precio_noche,
    }

    if (this.cancha.precio_dia_voley && this.cancha.precio_noche_voley && 
      this.cancha.largo_voley && this.cancha.ancho_voley) {

        this.procede = true;
      this.data = {
        empresa: this.id,
        descripcion: this.cancha.descripcion,
        tipo: this.cancha.tipo,
        largo: this.cancha.largo,
        ancho: this.cancha.ancho,
        largo_voley: this.cancha.largo_voley,
        ancho_voley: this.cancha.ancho_voley,
        precio_dia: this.cancha.precio_dia,
        precio_noche: this.cancha.precio_noche,
        precio_dia_voley: this.cancha.precio_dia_voley,
        precio_noche_voley: this.cancha.precio_noche_voley,
      }
    } else if(this.field_extra) {
      this._toastrService.error('Verifique y complete adecuadamente', 'CAMPOS INVÁLIDOS!');
      this.procede = false;
      this.load_btn_crear = false;
    }

    if (this.data.tipo == '' || !this.data.largo || !this.data.ancho || 
    !this.data.precio_dia || !this.data.precio_noche) {

      this._toastrService.error('Verifique y complete adecuadamente', 'CAMPOS INVÁLIDOS!');
      this.load_btn_crear = false;

    }  else if(this.procede) {
      this.load_btn_crear = false;
      this._userService.crear_cancha_empresa(this.id, this.token, this.data).subscribe(
        response => {
          this._toastrService.success('Se creó con éxito', 'CREADO!');
          this.load_btn_crear = false;
          this._router.navigate(['/grass/canchas']);
        }
      );
    }

    this.init_data();
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']);
  }
}

