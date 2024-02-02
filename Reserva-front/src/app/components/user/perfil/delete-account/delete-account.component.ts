import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})

export class DeleteAccountComponent implements OnInit {

  public user: any;
  public token;
  public pass: any;
  public password = '';
  public alert_pass = false;
  public valid = false;
  public deleting = false;

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
    this._title.setTitle('Perfil | Eliminar cuenta');
  }

  comparar_password() {
    let data = {
      email: this.user.email,
      password: this.pass
    }

    this._userService.comparar_password(data, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error(response.message, 'ERROR');

        } else if (response.data == true || response.data == 'true') {
          this._toastrService.success('Se verificó con éxito', 'VERIFICADO!');

          this.verificado = true;
          this.pass = '';
        }
      }
    );
  }


  eliminar_cuenta() {
    this.deleting = true;

    this._userService.eliminar_cuenta_user(this.user._id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error(response.message, 'ERROR');

        } else {
          this._toastrService.success('Se eliminó su cuenta', 'Eliminado!');

          location.reload();
          localStorage.clear();
          sessionStorage.clear();
        }
      }
    );

  }
}

