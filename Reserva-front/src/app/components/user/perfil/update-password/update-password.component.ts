import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  public user: any;
  public token;
  public pass: any;
  public passtext: any;
  public password = '';
  public password1 = '';
  public show = false;
  public alert_pass = false;
  public valid = false;

  public verificado: boolean = false;
  
  constructor(
    private _router: Router,
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ) {
    this.user = JSON.parse(localStorage.getItem('user_data')!);
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Actualizar contraseña');
    this.passtext = 'password';
  }

  comparar_password() {
    let data = {
      email: this.user.email,
      password: this.pass
    }

    // this._userService.comparar_password(data, this.token).subscribe(
    //   response => {        
    //     if (response.data == undefined) {
    //       this._toastrService.error(response.message, 'ERROR');

    //     } else if (response.data == true || response.data == 'true') {
    //       this._toastrService.success('Se verificó con éxito', 'VERIFICADO!');

    //       this.verificado = true;
    //       this.pass = '';
    //     }
    //   }
    //);
  }

  onClickPass() {
    if (this.passtext === 'password') {
      this.passtext = 'text';
      this.show = true;
    } else {
      this.passtext = 'password';
      this.show = false;
    }
  }

  compare_password() {
    if (this.password1 == this.password) {
      this.alert_pass = false;
      this.valid = true;

    } else if (this.password1 != this.password) {
      this.alert_pass = true;
      this.valid = false;
    }
  }

  actualizar_password() {
    let data = {
      password : this.password
    }
    // this._userService.actualizar_password_user(this.user._id, data, this.token).subscribe(
    //   response => {
    //     if (response.data == undefined) {
    //       this._toastrService.error(response.message, 'ERROR');

    //     } else if (response.data == true || response.data == 'true') {
    //       this._toastrService.success('Se actualizó la contraseña', 'ACTUALIZADO!');

    //       this.verificado = false;
    //       this.password = '';
    //       this.password1 = '';
    //       this.pass = '';
    //       this.show = false;
    //       this.valid = false;
    //       this._router.navigate(['/usuario/perfil']);
    //     }
    //   }
    // );

  }
}
