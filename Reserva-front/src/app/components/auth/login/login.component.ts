import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: any = {};
  public usuario: any = {};
  public token: any;
  public id: any;
  public id_cancha: any;
  public user_lc: any;
  public password: any;
  public show = false;

  public recordar = true;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.id_cancha = localStorage.getItem('id_cancha');

    if (this.token) {
      _userService.obtener_user(this.id, this.token).subscribe(response => {
        if (response.data == undefined) {
          _userService.obtener_empresa(this.id, this.token).subscribe(empresaResponse => {
            this.user = empresaResponse.data || response.data;
            localStorage.setItem('user_data', JSON.stringify(this.user));
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!) || undefined;
    
            if (this.user_lc) {
              switch (this.user_lc.role) {
                case 'GRASS':
                  this._router.navigate(['/grass']);
                  break;
                case 'ADMIN':
                  this._router.navigate(['/admin']);
                  break;
                case 'USER':
                  this._router.navigate(['/usuario']);
                  break;
                default:
                  this.user_lc = undefined;
              }
            } else {
              this.user_lc = undefined;
            }
          });
        } else {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          this.user_lc = JSON.parse(localStorage.getItem('user_data')!) || undefined;
    
          if (this.user_lc) {
            switch (this.user_lc.role) {
              case 'ADMIN':
                this._router.navigate(['/admin']);
                break;
              case 'USER':
                this._router.navigate(['/usuario']);
                break;
              default:
                this.user_lc = undefined;
            }
          } else {
            this.user_lc = undefined;
          }
        }
      });
    }
    
  }

  ngOnInit(): void {
    this._title.setTitle('Iniciar sesión');
    this.password = 'password';
  }

  login(loginForm: any) {
    if (loginForm.valid) {
      let data = {
        email: this.user.email,
        password: this.user.password
      }

      this._userService.login_user(data).subscribe(
        response => {
          if (response.data == undefined) {

            this._userService.login_empresa(data).subscribe(
              response => {
                if (response.data == undefined) {
                  this._toastrService.error(response.message, 'ERROR');

                } else if (response.data.verificado) {

                  if (this.recordar) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('_id', response.data._id);

                  } else {
                    sessionStorage.setItem('token', response.token);
                    sessionStorage.setItem('_id', response.data._id);
                  }
                  this.usuario = response.data;

                  if (this.usuario.role === 'GRASS') {
                    this._router.navigate(['/grass']).then(() => {
                      setTimeout(() => {
                        location.reload();
                      }, 500);
                    });

                  }
                } else {
                  this._toastrService.error('Empresa aún no verificada', 'ERROR!');
                  this._router.navigate(['/wait']);
                }
              }
            );

          } else if (response.data.verificado) {
            if (this.recordar) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('_id', response.data._id);
            } else {
              sessionStorage.setItem('token', response.token);
              sessionStorage.setItem('_id', response.data._id);
            }
            this.usuario = response.data;

            if (this.usuario.role === 'USER') {
              console.log(this.id_cancha);
              

              //No existe el id_cancha y se lleva al login normal
              if (this.id_cancha !== null) {
                this._router.navigate(['/usuario/perfil/reservas']).then(() => {
                  setTimeout(() => {
                    location.reload();
                  }, 500);
                });

                //Existe id_cancha
              } else if (this.id_cancha == null) {
                this._router.navigate(['/usuario']).then(() => {
                  setTimeout(() => {
                    location.reload();
                  }, 500);
                });
              }

            } else if (this.usuario.role === 'ADMIN') {
              this._router.navigate(['/admin']).then(() => {
                setTimeout(() => {
                  location.reload();
                }, 500);
              });
            }

          } else {
            this._toastrService.error('Correo aún no verificado', 'ERROR!');
            this._router.navigate(['/verificar']);
          }
        }
      );

    } else {
      console.log('Error');

    }
  }

  onClickPass() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

}
