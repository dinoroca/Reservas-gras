import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-caracteristicas',
  templateUrl: './caracteristicas.component.html',
  styleUrls: ['./caracteristicas.component.css']
})
export class CaracteristicasComponent implements OnInit {

  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public load_btn_crear = false;
  public btn_crear = false;
  public btn_actualzar = false;
  public car : any = {  };

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
    this._title.setTitle('GRASS | características');
  }

  init_data() {
    this._userService.obtener_caracteristicas_empresa(this.id, this.token).subscribe(
      response => {
        this.load_data = true;
        if (response.data == undefined) {

          this.car = {
            techado: false,
            canchas_futsal: 0,
            canchas_voley: 0,
            iluminacion: false,
            garaje: false
          } 
          
          this.load_data = false;
          this.btn_crear = true;
          this.btn_actualzar = false;
          
        } else if(response.data != undefined) {
          this.btn_actualzar = true;
          this.btn_crear = false;
          this.car = response.data[0];
          this.load_data = false;
        }
      }
    );
  }

  actualizar() {
    this.load_btn = true;
    let data = {
      empresa: this.id,
      techado: this.car.techado,
      canchas_futsal: this.car.canchas_futsal,
      canchas_voley: this.car.canchas_voley,
      iluminacion: this.car.iluminacion,
      garaje : this.car.garaje
    }

    this._userService.actualizar_caracteristicas_empresa(this.id, this.token, data).subscribe(
      response => {
        this._toastrService.success('Se actualizó con éxito', 'ACTUALIZADO!');
        this.load_btn = false;
      }
    );
    this.init_data();
  }

  crear() {
    this.load_btn_crear = true;
    let data = {
      empresa: this.id,
      techado: this.car.techado,
      canchas_futsal: this.car.canchas_futsal,
      canchas_voley: this.car.canchas_voley,
      iluminacion: this.car.iluminacion,
      garaje : this.car.garaje
    }

    this._userService.crear_caracteristicas_empresa(this.id, this.token, data).subscribe(
      response => {
        this._toastrService.success('Se creó con éxito', 'CREADO!');
        this.load_btn_crear = false;
      }
    );
    
    this.init_data();
  }
}
