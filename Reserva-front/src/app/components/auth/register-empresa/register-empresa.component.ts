import { Component, OnInit } from '@angular/core';
//import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-empresa',
  templateUrl: './register-empresa.component.html',
  styleUrls: ['./register-empresa.component.css']
})

export class RegisterEmpresaComponent implements OnInit {

  public user: any = {

  };

  public password: any;
  public password1 = '';
  public show = false;
  public alert_pass = false;

  public valid = false;

  public recordar = true;

  constructor(
    //private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

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

  registrar(registroForm: any) {
    if (registroForm.valid) {

      let data = {
        nombres: this.user.nombres,
        apellidos: this.user.apellidos,
        email: this.user.email,
        telefono: this.user.telefono,
        password: this.user.password,
      }

      // this._userService.registro_user(data).subscribe(
      //   response => {
      //     if (response.data == undefined) {
      //       this._toastrService.error(response.message, 'ERROR');

      //     } else if (response.data != undefined) {
      //       localStorage.setItem('_id', response.data._id);

      //       this._userService.enviar_correo_confirmacion(response.data._id).subscribe(
      //         response => {
      //           if (response.data) {
      //             this._toastrService.success('Se envió el código de verificación', 'ENVIADO!');
      //             this._router.navigate(['/verificar']);
      //           }
      //         }
      //       );
      //     }
      //   }
      // );
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
