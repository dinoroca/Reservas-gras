import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})

export class ClientesComponent implements OnInit {
  public user_lc: any = {};
  public empresa: any = {};
  public token: any;
  public id: any;
  public load_data = true;
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
    this._title.setTitle('GRASS | Clientes');
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
          
          this._userService.obtener_clientes_empresa(this.empresa._id, this.token).subscribe(
            response => {
              if (response.data == undefined) {
                this.exist_client = false;
              } else {
                this.exist_client = true;
                this.clientes = response.data;
              }
            }
          );
          
          this.load_data = false;
        }
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


