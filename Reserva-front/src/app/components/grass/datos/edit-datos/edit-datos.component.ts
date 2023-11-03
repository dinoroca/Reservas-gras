import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GuestService } from 'src/app/services/guest.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-datos',
  templateUrl: './edit-datos.component.html',
  styleUrls: ['./edit-datos.component.css']
})
export class EditDatosComponent implements OnInit {

  public empresa: any = {
  };

  public user: any = {};

  public regiones: Array<any> = [];
  public namereg ='';
  public provincias: Array<any> = [];
  public nameprov ='';
  public distritos: Array<any> = [];

  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];
  public vacio = true;

  public valid = false;

  public recordar = true;

  public usuario: any = {};
  public token: any;
  public id: any;
  public user_lc: any;

  isDisabledProvincia = true;
  isDisabledDistrito = true;

  constructor(
    //private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _guestService: GuestService,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);

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

  ngOnInit(): void {
    this._title.setTitle('GRASS | Actualizar datos');
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
    
  }

  actualizar(registroForm: any) {
    if (registroForm.valid) {

      let data = {
        nombre: this.user_lc.nombre,
        direccion: this.user_lc.direccion,
        email: this.user_lc.email,
        telefono: this.user_lc.telefono,
        region: this.namereg,
        provincia: this.nameprov,
        distrito: this.user_lc.distrito,
        ubicacion: this.user_lc.ubicacion,
      }

      // this._userService.registro_empresa(data).subscribe(
      //   response => {
      //     if (response.data == undefined) {
      //       this._toastrService.error(response.message, 'ERROR');

      //     } else if (response.data != undefined) {
      //       localStorage.setItem('_id', response.data._id);

      //       this._toastrService.success('Se registró con éxito', 'REGISTRADO!');
      //       this._router.navigate(['/wait']);

      //       // this._userService.enviar_correo_confirmacion(response.data._id).subscribe(
      //       //   response => {
      //       //     if (response.data) {
      //       //       this._toastrService.success('Se envió el código de verificación', 'ENVIADO!');
      //       //       this._router.navigate(['/verificar']);
      //       //     }
      //       //   }
      //       // );
      //     }
      //   }
      // );
    } else {
      this._toastrService.error('Los datos del formulario no son válidos', 'ERROR');
    }
  }

}

