import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { GuestService } from 'src/app/services/guest.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: any = {
    region: '',
  };

  public password: any;
  public password1 = '';
  public show = false;
  public alert_pass = false;

  public regiones: Array<any> = [];
  public namereg ='';

  public valid = false;

  public recordar = true;
  public load_register = false;

  public usuario: any = {};
  public token: any;
  public id: any;
  public user_lc: any;

  constructor(
    private _userService: UserService,
    private _guestService: GuestService,
    private _router: Router,
    private _title: Title,
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

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

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
  }

  ngOnInit(): void {
    this._title.setTitle('Registro de usuario');
    this.password = 'password';
  }

  //Comparar contraseñas
  compare_password() {
    if (this.password1 == this.user.password) {
      this.alert_pass = false;
      this.valid = true;

    } else if (this.password1 != this.user.password) {
      this.alert_pass = true;
      this.valid = false;
    }
  }

  select_region() {
    const regencontrado = this.regiones.find(objeto => objeto.id === this.user.region);

    this.namereg = regencontrado.name;
  }

  registrar(registroForm: any) {
    this.load_register = true;
    if (registroForm.valid) {

      let data = {
        nombres: this.user.nombres,
        email: this.user.email,
        ciudad: this.namereg,
        telefono: this.user.telefono,
        password: this.user.password,
      }

      this._userService.registro_user(data).subscribe(
        response => {
          if (response.data == undefined) {
            this._toastrService.error(response.message, 'ERROR');
            this.load_register = false;

          } else if (response.data != undefined) {
            localStorage.setItem('_id', response.data._id);
            this._toastrService.success('Se registró con éxito', 'REGISTRADO!');
            localStorage.setItem('user_email', this.user.email);
            this.load_register = false;
            this._router.navigate(['/verificar']);

            this._userService.enviar_correo_confirmacion(response.data._id).subscribe(
              response => {
                if (response.data) {
                  this._toastrService.success('Se envió el código de verificación', 'ENVIADO!');
                  this._router.navigate(['/verificar']);
                }
              }
            );
          }
        }
      );
    } else {
      this._toastrService.error('Los datos del formulario no son válidos', 'ERROR');
      this.load_register = false;
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
