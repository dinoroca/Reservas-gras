import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {

  public user: any;
  public pagos: Array<any> = [];
  public activePagos: boolean = false;
  public token: any;
  public id: any;
  
  constructor(
    private _userService: UserService,
    private _router: Router
  ) {

    this.user = JSON.parse(localStorage.getItem('user_data')!);
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    // this._userService
    //   .obtener_pagos_cliente(this.id, this.token)
    //   .subscribe((response) => {
    //     this.pagos = response.data;

    //     if (this.pagos) {
    //       for (let i = 0; i < this.pagos.length; i++) {
          
    //         if (this.pagos[i].estado == 'Confirmado') {
    //           this.activePagos = true;
    //           break;
    //         } else {
    //           this.activePagos = false;
    //         }
    //       } 
    //     } else {
    //       this.activePagos = false;
    //     }
    //   });
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
  }
}
