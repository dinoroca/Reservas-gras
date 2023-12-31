import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GuestService } from 'src/app/services/guest.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-actualizar',
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})

export class ActualizarComponent implements OnInit {

  public user: any = {};
  public id: any;
  public token;
  public load_btn = false;
  public load_data = true;
  public passwClass: any;
  public valid = false;

  public regiones: Array<any> = [];
  public namereg ='';

  public vacio = true;

  isDisabledArea = true;
  isDisabledEscuela = true;

  constructor(
    private _userService: UserService,
    private _guestService: GuestService,
    private _router: Router,
    private _toastrService: ToastrService,
    private _title: Title
  ){
    
    this._guestService.obtener_regiones().subscribe(
      response => {
        response.forEach((element: { id: any; name: any; }) => {
          this.regiones.push(element.name);
        });
      }
    );

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user_data')!);
    this.id = this.user._id;

  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Actualizar datos');
    this.passwClass = 'password';
  }

  select_region() {
    const regencontrado = this.user.ciudad;

    this.namereg = regencontrado;
  }

  actualizar(updateForm: any) {    
    if(updateForm.valid) {
      this.load_btn = true;
      this._userService.actualizar_user(this.id, this.user, this.token).subscribe(
        response => {
          if (response.data == undefined) {
            this._toastrService.error(response.message, 'ERROR');
          } else {
            this._toastrService.success('Se actualizó con éxito', 'ACTUALIZADO!');
            this.load_btn = false;
            this._router.navigate(['/usuario']);
          }
        }
      );
    } else {
      this._toastrService.error('Datos inválidos en el formulario', 'ERROR');
    }
  }

}

