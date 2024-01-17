import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-index-res',
  templateUrl: './index-res.component.html',
  styleUrls: ['./index-res.component.css']
})


export class IndexResComponent implements OnInit {
  public user_lc: any = {};
  public empresa: any = {};
  public token: any;
  public id: any;
  public load_data = false;
  public load_btn = false;
  public exist_res = true;
  public reservaciones: Array<any> = [];

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
    this._title.setTitle('GRASS | Mis reservaciones');
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
          
          this._userService.obtener_reservaciones_empresa(this.empresa._id, this.token).subscribe(
            response => {
              if (response.data == undefined) {
                this.exist_res = false;
              } else {
                this.exist_res = true;
                this.reservaciones = response.data;
              }
            }
          );
          
          this.load_data = false;
        }
      }
    );
  }

  eliminar_reservacion(id: any) {
    this.load_btn = true;
    this._userService.eliminar_reservacion_empresa(id, this.token).subscribe(
      response => {
        this._toastrService.success('Se eliminó con éxito', 'ELIMINADO!');

        this.load_btn = false;
        this.init_data();
      }
    );
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']);
  }
}

