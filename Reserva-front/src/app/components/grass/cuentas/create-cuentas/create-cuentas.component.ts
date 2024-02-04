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
    banco: '',
    color: '#FFFFFF'
  };
  public bancos = ['Yape', 'Plin', 'BCP', 'Interbank', 'Banco de la Nación', 'BBVA'];
  public colores = ['#c47cff', '#00E2CD', '#FF961F', '#64e598', '#ff7575', '#61dddd'];
  public token;
  public id;
  public load_btn = false;
  public esCuenta = true;
  public limiteCuenta = 20;

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

  public actualizarColor(): void {
    const indice = this.bancos.indexOf(this.cuenta.banco);
    if (indice !== -1) {
      this.cuenta.color = this.colores[indice];
    } else {
      this.cuenta.color = '#FFFFFF'; // Color por defecto si el banco no se encuentra en la lista
    }
  }

  // Esta función se llama cuando cambia la selección del banco
  public onBancoChange(): void {
    this.actualizarColor();

    if (this.cuenta.banco == 'Yape' || this.cuenta.banco == 'Plin') {
      this.esCuenta = false;
      this.limiteCuenta = 9;
    } else {
      this.esCuenta = true;
      this.limiteCuenta = 20;
    }
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
