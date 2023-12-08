import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-cuentas',
  templateUrl: './edit-cuentas.component.html',
  styleUrls: ['./edit-cuentas.component.css']
})
export class EditCuentasComponent implements OnInit {

  public cuenta : any = {};
  public token;
  public id: any;
  public load_btn = false;
  public load_data = true;

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Actualizar Cuenta');

    this._route.params.subscribe(
      
      params => {
        this.id = params['id'];
        
        this._userService.obtener_cuenta_grass(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined) {
              this.cuenta = undefined;
              this.load_data = false;
            }else {
              this.cuenta = response.data;
              this.load_data = false;
            }
          }
        );
      }
    );
  }

  actualizar(actualizarForm: any){

    if(actualizarForm.valid){
      this.load_btn = true;
      this._userService.actualizar_cuenta_grass(this.id, this.cuenta, this.token).subscribe(
        response => {
          if (response.data == undefined) {
            this._toastrService.error(response.message, 'ERROR');

          } else {

            this._toastrService.success('Se actualizó con éxito', 'ACTUALIZADO!');

            this._router.navigate(['/gass/cuentas']);
          }
        }
      );
    }
  }

}
