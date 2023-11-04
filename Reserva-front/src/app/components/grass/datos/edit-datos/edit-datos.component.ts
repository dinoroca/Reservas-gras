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

  public regiones: Array<any> = [];
  public namereg ='';
  public provincias: Array<any> = [];
  public nameprov ='';
  public distritos: Array<any> = [];

  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];
  public vacio = true;

  public valid = false;
  public load_btn = false;
  public load_data = false;

  public token: any;
  public id: any;
  public user_lc: any = {

  };

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

    _userService.obtener_empresa(this.id, this.token).subscribe(
      response => {
        this.load_data = true;
        if (response.data == undefined) {
          this._toastrService.error('Usuario inexistente', 'ERROR!');
          this.load_data = false;
        } else {
          this.empresa = response.data;
          this.load_data = false;
        }
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Actualizar datos');
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

      this._userService.actualizar_empresa(this.id, data, this.token).subscribe(
        response => {
          this.load_btn = true;
          if (response.data == undefined) {
            this._toastrService.error(response.message, 'ERROR');
          } else {
            this._toastrService.success('Se actualizó con éxito', 'ACTUALIZADO!');
            this.load_btn = false;
            this._router.navigate(['/grass']);
          }
        }
      );
    } else {
      this._toastrService.error('Los datos del formulario no son válidos', 'ERROR');
    }
  }

}

