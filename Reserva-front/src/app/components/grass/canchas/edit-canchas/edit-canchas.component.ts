import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-canchas',
  templateUrl: './edit-canchas.component.html',
  styleUrls: ['./edit-canchas.component.css']
})

export class EditCanchasComponent implements OnInit {

  public cancha : any = {};
  public token;
  public id: any;
  public load_btn = false;
  public load_btn_act = false;
  public load_data = true;
  public field_extra = false;

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
    this._title.setTitle('GRASS | Editar cancha');

    this._route.params.subscribe(
      
      params => {
        this.id = params['id'];
        
        this._userService.obtener_cancha_empresa(this.id, this.token).subscribe(
          response => {
            if(response.data == undefined) {
              this.cancha = undefined;
              this.load_data = false;
            }else {
              this.cancha = response.data;
              if (this.cancha.tipo == 'Mixto') {
                this.field_extra = true;
              }
              this.load_data = false;
            }
          }
        );
      }
    );
  }

  actualizar(){
    this.load_btn_act = true;
      this._userService.actualizar_cancha_empresa(this.id, this.cancha, this.token).subscribe(
        response => {
          if (response.data == undefined) {
            this._toastrService.error(response.message, 'ERROR');

          } else {
            this._toastrService.success('Se actualizó con éxito', 'ACTUALIZADO!');
            this.load_btn_act = false;
            this._router.navigate(['/grass/canchas']);
          }
        }
      );
  }

}

