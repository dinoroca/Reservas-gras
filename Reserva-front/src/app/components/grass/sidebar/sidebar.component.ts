import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public user: any;

  constructor() {
    this.user = JSON.parse(localStorage.getItem('user_data')!);
  }

}
