import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-index-cuentas',
  templateUrl: './index-cuentas.component.html',
  styleUrls: ['./index-cuentas.component.css']
})
export class IndexCuentasComponent implements OnInit {

  public token: any;
  public id: any;
  public cuentas: Array<any> = [];
  public load_btn = false;
  public btn_crear = false;
  public load_data = true;

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._title.setTitle('ADMIN | Cuentas');

    this.init_data();
  }

  init_data() {
    this.cuentas = [];
    this._userService.obtener_cuentas_admin(this.id, this.token).subscribe(
      response => {
        if (response.data.length == 0) {
          this.load_data = false;
          this.btn_crear = true;

        } else {
          this.cuentas = response.data;
          this.load_data = false;
          this.btn_crear = false;
        }
      }
    );
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._userService.eliminar_cuenta_admin(id, this.token).subscribe(
      response => {
        this._toastrService.success('Se eliminó con éxito', 'ELIMINADO!');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

}
