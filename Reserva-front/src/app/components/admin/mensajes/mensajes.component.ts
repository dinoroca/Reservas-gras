import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mensajes',
  templateUrl: './mensajes.component.html',
  styleUrls: ['./mensajes.component.css']
})
export class MensajesComponent implements OnInit{

  public mensajes: Array<any> = [];
  public load_data = true;
  public token;
  p: number = 1;

  constructor(
    private _userService: UserService,
    private _toastrService: ToastrService,
    private _title: Title
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');

    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('ADMIN | Mensajes');
  }

  init_data() {
    this._userService.obtener_mensajes_admin(this.token).subscribe(
      response => {
        this.mensajes = response.data;
        this.load_data = false;
      }
    );
  }

  cerrar_mensaje(id: any) {
    this._userService.cerrar_mensaje_admin(id, {data: undefined}, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this._toastrService.error(response.message, 'ERROR');
        } else {
          this._toastrService.success('Se cerró con éxito', 'CERRADO!');

          this.init_data();
        }
      }
    );
  }

}
