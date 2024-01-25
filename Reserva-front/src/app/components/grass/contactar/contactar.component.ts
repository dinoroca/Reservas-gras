import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contactar',
  templateUrl: './contactar.component.html',
  styleUrls: ['./contactar.component.css']
})

export class ContactarComponent implements OnInit {
  public user_lc: any = {};
  public empresa: any = {};
  public contacto: any = {};
  public token: any;
  public id: any;
  public load_data = true;
  public load_btn = false;
  public exist_client = true;
  public clientes: Array<any> = [];
  p: number = 1;

  constructor(
    private _router: Router,
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {

    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this.init_data();
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Contáctanos');
  }

  init_data() {
    this._userService.obtener_empresa(this.id, this.token).subscribe(
      response => {
        this.load_data = true;
        if (response.data == undefined) {
          this._toastrService.error('Usuario inexistente', 'ERROR!');
          this.load_data = false;
          this.logout();
        } else {

          this.empresa = response.data;
          this.contacto.cliente = this.empresa.nombre;
          this.contacto.correo = this.empresa.email;
          this.contacto.telefono = this.empresa.telefono;

          this.load_data = false;
        }
      }
    );
  }

  registro(registroForm: any) {
    if (registroForm.valid) {
      this.load_btn = true;
      this._userService.enviar_mensaje_contacto(this.contacto).subscribe(
        response => {
          this._toastrService.success('Se envió correctamente el mensaje', 'ENVIADO!');

          this.contacto = {};
          this.load_btn = false;
        }
      );
    } else {
      this._toastrService.error('No se envió, error!', 'ERROR!');
    }
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']);
  }
}



