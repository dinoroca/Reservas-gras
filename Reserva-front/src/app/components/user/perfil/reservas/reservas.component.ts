import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  public pagos: Array<any> = [];
  public cuentas: Array<any> = [];

  public load_data: boolean = true;
  public activePagos: boolean = false;
  public viewButton: boolean = false;

  constructor(
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

  }

  ngOnInit() {
    this._title.setTitle('Perfil | Mis reservaciones');
  }

  registrar_pago_basico() {}

}
