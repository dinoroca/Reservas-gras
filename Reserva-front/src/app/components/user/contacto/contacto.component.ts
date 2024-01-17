import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})

export class ContactoComponent implements OnInit {

  public contacto: any = {};
  public id: any;
  public token: any;
  public user: any = {};
  public load_btn = false;

  constructor(
    private _title: Title,
    private _toastrService: ToastrService,
    private _userService: UserService
  ) {

    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');

    _userService.obtener_user(this.id, this.token).subscribe(
      response => {
        this.user = response.data;
        this.contacto.cliente = this.user.nombres;
        this.contacto.correo = this.user.email;
        this.contacto.telefono = this.user.telefono;
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('Contacto');
  }

  registro(registroForm: any) {
    if(registroForm.valid) {
      this.load_btn = true;
      this._userService.enviar_mensaje_contacto(this.contacto).subscribe(
        response =>{
          this._toastrService.success('Se envió correctamente el mensaje', 'ENVIADO!');

          this.contacto = {};
          this.load_btn = false;
        }
      );
    } else {
      this._toastrService.error('No se envió, error!', 'ERROR!');
    }
  }

}
