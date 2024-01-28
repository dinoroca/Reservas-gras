import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  public token: any;
  public id: any;
  public empresas: Array<any> = [];
  public canchas: Array<any> = [];
  public load_btn = false;
  public btn_crear = false;
  public load_data = true;
  public load_canchas = true;
  public exist_canchas = true;
  p: number = 1;

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._title.setTitle('ADMIN | Empresas');

    this.init_data();
  }

  init_data() {
    this.empresas = [];
    this._userService.obtener_empresas_admin(this.token).subscribe(
      response => {
        if (response.data.length == 0) {
          this.load_data = false;
          this.btn_crear = true;

        } else {
          this.empresas = response.data;
          this.load_data = false;
          this.btn_crear = false;
        }
      }
    );
  }

  verificar_empresa(id: any) {
    this._userService.actualizar_empresa_verificado_admin(id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error(response.message, 'ERROR');
        } else {
          this._toastrService.success('Se actualizó con éxito', 'ACTUALIZADO!');
          this.init_data();
        }
      }
    );
  }

  obtener_canchas(id: any) {
    this.load_canchas = true;
    this.canchas = [];
    this._userService.obtener_canchas(id).subscribe(
      resposne => {
        if (resposne.data == undefined) {
          this.exist_canchas = false;
          this.load_canchas = false;
        } else {
          this.canchas = resposne.data;
          this.exist_canchas = true;
          this.load_canchas = false;
        }
      }
    );
  }

}
