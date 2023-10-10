import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GuestService } from 'src/app/services/guest.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {
    
  }

  public empresa: any = {
    region: '',
    provincia: '',
    distrito: ''
  };

  public regiones: Array<any> = [];
  public namereg ='';
  public provincias: Array<any> = [];
  public nameprov ='';
  public distritos: Array<any> = [];

  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];

  isDisabledProvincia = true;
  isDisabledDistrito = true;

  constructor (
    private _router: Router,
    private _title: Title,
    private _guestService: GuestService,
    private _userService: UserService,
  ) {

    this._guestService.obtener_regiones().subscribe(
      response => {
        response.forEach((element: { id: any; name: any; }) => {
          this.regiones.push({
            id: element.id,
            name: element.name
          });
        });
      }
    );

  }

  select_region() {
    this.provincias = [];
    this.distritos = [];
    this.isDisabledProvincia = false;
    this.isDisabledDistrito = true;
    this.empresa.provincia = '';
    this.empresa.distrito = '';
    this._guestService.obtener_provincias().subscribe(
      response => {
        response.forEach((element: { department_id: any; }) => {
          if (element.department_id == this.empresa.region) {
            this.provincias.push(element);
          }
        });
      }
    );
    
    const regencontrado = this.regiones.find(objeto => objeto.id === this.empresa.region);

    this.namereg = regencontrado.name;
    console.log(this.namereg);
  }

  select_provincia() {
    this.distritos = [];
    this.isDisabledDistrito = false;
    this.empresa.distrito = '';
    this._guestService.obtener_distritos().subscribe(
      response => {
        response.forEach((element: { province_id: any; }) => {
          if (element.province_id == this.empresa.provincia) {
            this.distritos.push(element);
          }
        });
      }
    );

    const provencontrado = this.provincias.find(objeto => objeto.id === this.empresa.provincia);

    this.nameprov = provencontrado.name;
    console.log(this.nameprov);
    
  }

}
