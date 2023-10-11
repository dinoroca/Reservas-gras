import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})

export class ContactosComponent implements OnInit {

  public contacto: any = {};
  public load_btn = false;

  constructor(
    private _title: Title,
    private _toastrService: ToastrService,
    private _userService: UserService
  ) {

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
