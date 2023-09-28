import { Component, OnInit } from '@angular/core';
//import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GuestService } from 'src/app/services/guest.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-empresa',
  templateUrl: './register-empresa.component.html',
  styleUrls: ['./register-empresa.component.css']
})

export class RegisterEmpresaComponent implements OnInit {

  public empresa: any = {
    region: '',
    provincia: '',
    distrito: ''
  };

  public password: any;
  public password1 = '';
  public show = false;
  public alert_pass = false;

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
    this._title.setTitle('Registro de usuario');
    this.password = 'password';
  }

  //Comparar contraseñas
  compare_password() {
    if (this.password1 == this.empresa.password) {
      this.alert_pass = false;
      this.valid = true;

    } else if (this.password1 != this.empresa.password) {
      this.alert_pass = true;
      this.valid = false;
    }
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

  select_distrito() {
    console.log(this.empresa);
  }

  registrar(registroForm: any) {
    if (registroForm.valid) {

      console.log(this.empresa.email);
      

      let data = {
        nombre: this.empresa.nombre,
        user_name: this.empresa.username,
        email: this.empresa.email,
        telefono: this.empresa.telefono,
        region: this.namereg,
        provincia: this.nameprov,
        distrito: this.empresa.distrito,
        ubicacion: this.empresa.ubicacion,
        password: this.empresa.password,
      }

      this._userService.registro_empresa(data).subscribe(
        response => {
          if (response.data == undefined) {
            this._toastrService.error(response.message, 'ERROR');

          } else if (response.data != undefined) {
            localStorage.setItem('_id', response.data._id);

            this._toastrService.success('Se registró con éxito', 'REGISTRADO!');
            this._router.navigate(['/wait']);

            // this._userService.enviar_correo_confirmacion(response.data._id).subscribe(
            //   response => {
            //     if (response.data) {
            //       this._toastrService.success('Se envió el código de verificación', 'ENVIADO!');
            //       this._router.navigate(['/verificar']);
            //     }
            //   }
            // );
          }
        }
      );
    } else {
      this._toastrService.error('Los datos del formulario no son válidos', 'ERROR');
    }
  }

  onClickPass() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

}
