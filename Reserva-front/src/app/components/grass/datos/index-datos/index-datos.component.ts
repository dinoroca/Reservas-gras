import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-datos',
  templateUrl: './index-datos.component.html',
  styleUrls: ['./index-datos.component.css']
})
export class IndexDatosComponent implements OnInit {
  public user_lc: any = {};

  constructor(
    private _router: Router,
    private _title: Title
  ) {
    
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
    
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Mis datos');
  }

  logout() {
    location.reload();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']);
  }
}
