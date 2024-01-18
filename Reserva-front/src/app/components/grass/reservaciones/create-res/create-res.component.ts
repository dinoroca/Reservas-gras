import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-res',
  templateUrl: './create-res.component.html',
  styleUrls: ['./create-res.component.css']
})
export class CreateResComponent implements OnInit {

  public token;
  public id;
  public load_btn = true;
  public canchas: Array<any> = [];

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    _userService.obtener_canchas_empresa(this.id, this.token).subscribe(
      response => {
        this.load_btn = true;
        if (response == undefined) {
          this.canchas = [];
        } else {
          this.canchas = response.data;
          this.load_btn = false;
        }
      }
    );
  }


  ngOnInit(): void {
    this._title.setTitle('GRASS | Crear reservación');
  }

}
