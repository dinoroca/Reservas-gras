import { Component, OnInit } from '@angular/core';
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

  public user: any = {};

  public password: any;
  public password1 = '';
  public show = false;
  public showAlertLink = false;
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
  public validLink = false;

  public recordar = true;

  public usuario: any = {};
  public token: any;
  public id: any;
  public user_lc: any;

  public load_btn_crear = false;
  public car : any = { };

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

    if (this.token) {
      _userService.obtener_user(this.id, this.token).subscribe(response => {
        if (response.data == undefined) {
          _userService.obtener_empresa(this.id, this.token).subscribe(empresaResponse => {
            this.user = empresaResponse.data || response.data;
            localStorage.setItem('user_data', JSON.stringify(this.user));
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!) || undefined;
    
            if (this.user_lc) {
              switch (this.user_lc.role) {
                case 'GRASS':
                  this._router.navigate(['/grass']);
                  break;
                case 'ADMIN':
                  this._router.navigate(['/admin']);
                  break;
                case 'USER':
                  this._router.navigate(['/usuario']);
                  break;
                default:
                  this.user_lc = undefined;
              }
            } else {
              this.user_lc = undefined;
            }
          });
        } else {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          this.user_lc = JSON.parse(localStorage.getItem('user_data')!) || undefined;
    
          if (this.user_lc) {
            switch (this.user_lc.role) {
              case 'ADMIN':
                this._router.navigate(['/admin']);
                break;
              case 'USER':
                this._router.navigate(['/usuario']);
                break;
              default:
                this.user_lc = undefined;
            }
          } else {
            this.user_lc = undefined;
          }
        }
      });
    }

    this.car = {
      techado: false,
      canchas_futsal: 0,
      canchas_voley: 0,
      iluminacion: false,
      garaje: false
    } 
    
  }

  ngOnInit(): void {
    this._title.setTitle('Registro de empresas');
    this.password = 'password';
  }

  validarURL() {
    const urlRegex = /^(https:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9]+)$/;

    if (urlRegex.test(this.empresa.ubicacion)) {
      this.validLink = true;
      this.showAlertLink = false;
    } else {
      this.validLink = false;
      this.showAlertLink = true;
    }
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

  registrar(registroForm: any) {
    if (registroForm.valid) {

      let data = {
        nombre: this.empresa.nombre,
        direccion: this.empresa.direccion,
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

            let dataChar = {
              empresa: response.data._id,
              techado: this.car.techado,
              canchas_futsal: this.car.canchas_futsal,
              canchas_voley: this.car.canchas_voley,
              iluminacion: this.car.iluminacion,
              garaje : this.car.garaje
            }
        
            this._userService.crear_caracteristicas_empresa(response.data._id, response.token, dataChar).subscribe(
              response => {
              }
            );
            

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
