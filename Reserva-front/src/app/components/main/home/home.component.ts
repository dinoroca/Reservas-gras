import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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


  //------------- se aumento
  public searchOption: string = 'name';
  //-----------

  ngOnInit(): void {

  }

  public empresa: any = {
    region: '',
    provincia: '',
    distrito: ''
  };

  public regiones: Array<any> = [];
  public namereg = '';
  public provincias: Array<any> = [];
  public nameprov = '';
  public distritos: Array<any> = [];

  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];

  public empresas: Array<any> = [];
  public busqueda = '';
  public load_search = false;
  public load_data = true;
  public show_alert_void = false;
  public show_card_empresas = false;

  public empresas_ubication: Array<any> = [];
  public busqueda_ubication = '';
  public load_search_ubication = false;
  public load_data_ubication = true;
  public show_alert_void_ubication = false;
  public show_card_empresas_ubication = false;

  isDisabledProvincia = true;
  isDisabledDistrito = true;
  public reviews: Array<any> = [];
  public reviewsDestacados: Array<any> = [];
  screenWidth: number = 0;
  screenHeight: number = 0;

  public imagen_fondo: String = '';
  @ViewChild('textoAnimado') textoAnimado: any;
  texto: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  constructor(
    private _router: Router,
    private _title: Title,
    private _guestService: GuestService,
    private _userService: UserService,
  ) {

    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

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

    if (this.screenWidth < this.screenHeight) {
      this.imagen_fondo = '../../../../assets/img/fondo-comentario.jpg';
    } else {
      this.imagen_fondo = '../../../../assets/img/fondo-coment.png';
    }

    this.init_data();
  }

  init_data() {
    this.show_card_empresas = false;
    this.show_alert_void = false;
  }

  buscarName() {
    if (this.busqueda) {
      this.show_alert_void = false;
      this.load_search = true;
      this.show_card_empresas = true;
      this.show_card_empresas_ubication = false;
      this.show_alert_void_ubication = false;
      this._userService.listar_empresas_filtro(this.busqueda).subscribe(
        response => {

          if (response.data != undefined) {
            this.empresas = response.data;


            this.load_data = false;

          } else {
            this.show_alert_void = true;
            this.show_card_empresas = false;
          }

          this.load_search = false;
        },
      );
    }
    if (this.busqueda == '') {
      this.init_data();
    }
  }

  select_region() {
    this.provincias = [];
    this.distritos = [];
    this.isDisabledProvincia = false;
    this.isDisabledDistrito = true;
    this.empresa.provincia = '';
    this.nameprov = '';
    this.empresa.distrito = '';
    this.load_search_ubication = true;
    this.busqueda = '';
    this.init_data();
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

    this._userService.listar_empresas_region(this.namereg).subscribe(
      response => {

        if (response.data != undefined) {
          this.empresas_ubication = response.data;
          this.show_card_empresas_ubication = true;
          this.load_data_ubication = false;
          this.show_alert_void_ubication = false;

        } else {
          this.show_alert_void_ubication = true;
          this.show_card_empresas_ubication = false;
        }

        this.load_search_ubication = false;
      },
    );
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

    this._userService.listar_empresas_prov(this.namereg, this.nameprov).subscribe(
      response => {

        if (response.data != undefined) {
          this.empresas_ubication = response.data;
          this.show_card_empresas_ubication = true;
          this.load_data_ubication = false;
          this.show_alert_void_ubication = false;

        } else {
          this.show_alert_void_ubication = true;
          this.show_card_empresas_ubication = false;
        }

        this.load_search_ubication = false;
      },
    );

  }

  select_distrito() {
    this._userService.listar_empresas_dist(this.namereg, this.nameprov, this.empresa.distrito).subscribe(
      response => {

        if (response.data != undefined) {
          this.empresas_ubication = response.data;
          this.show_card_empresas_ubication = true;
          this.load_data_ubication = false;
          this.show_alert_void_ubication = false;

        } else {
          this.show_alert_void_ubication = true;
          this.show_card_empresas_ubication = false;
        }

        this.load_search_ubication = false;
      },
    );
  }

  //------------se aumento
  changeSearchOption(option: string) {
    this.searchOption = option;
  }

}


