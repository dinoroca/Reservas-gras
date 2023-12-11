import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-cuentas',
  templateUrl: './create-cuentas.component.html',
  styleUrls: ['./create-cuentas.component.css']
})
export class CreateCuentasComponent implements OnInit {

  public cuenta : any = {
    color: '#FFFFFF'
  };
  public token;
  public id;
  public load_btn = false;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    _userService.obtener_empresa(this.id, this.token).subscribe(
      response => {

        if (response.data == undefined) {
          this.logout();
        } else {
          this.cuenta.empresa = response.data._id;
        }
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Registrar Cuenta');
  }

  registro(registroForm: any){
    if(registroForm.valid){
      this.load_btn = true;
      this._userService.registro_cuenta_grass(this.cuenta, this.token).subscribe(
        response => {
          if (response.data == undefined) {
            this._toastrService.error(response.message, 'ERROR');

          } else {

            this._toastrService.success('Se registró con éxito', 'REGISTRADO!');

            this._router.navigate(['/grass/cuentas']);
          }
        }
      );
    }
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']);
  }

}
