import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verify-mail',
  templateUrl: './verify-mail.component.html',
  styleUrls: ['./verify-mail.component.css']
})
export class VerifyMailComponent implements OnInit {

  public codigo = '';
  public id: any;

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService,
    private _router: Router
  ) {

    this.id = localStorage.getItem('_id');
  }

  ngOnInit(): void {
    this._title.setTitle('Verificar correo');
  }

  verificar(verificarForm: any) {
    if (verificarForm.valid) {
      if (this.id) {
        this._userService.actualizar_user_verificado(this.id, this.codigo).subscribe(
          response => {
            if (response.data != undefined) {
              this._toastrService.success('Se verificó correctamente', 'VERIFICADO!');
              this._router.navigate(['/login']);
            } else {
              this._toastrService.error('Código incorrecto, vuelve a intentarlo', 'ERROR');
              this.codigo = '';
            }
          }
        );
      } else {
        this._toastrService.error('Verifique su cuenta en el mismo dispositivo', 'ERROR');
        this.codigo = '';
      }
    }
  }

}
