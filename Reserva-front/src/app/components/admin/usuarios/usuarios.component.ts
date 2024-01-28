import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit {

  public token: any;
  public id: any;
  public load_data = true;
  public exist_client = true;
  public clientes: Array<any> = [];
  p: number = 1;

  constructor(
    private _title: Title,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {
    
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    
  }
  
  ngOnInit(): void {
    this._title.setTitle('ADMIN | Clientes');
    this.init_data();
  }

  init_data() {
    this.load_data = true;
    this._userService.obtener_clientes_admin(this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.exist_client = false;
        } else {
          this.clientes = response.data;
          this.exist_client = true;
          this.load_data = false;
        }
      }
    );
    
  }
}



