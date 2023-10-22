import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})

export class DatosComponent implements OnInit {

  public user_lc: any = {};

  constructor(
    private _router: Router,
    private _title: Title
  ) {
    
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
    
  }

  ngOnInit(): void {
    this._title.setTitle('Perfil | Mis datos');
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']);
  }

}
