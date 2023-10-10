import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  public user_lc: any = {};

  constructor(
  ) {
    this.user_lc = JSON.parse(localStorage.getItem('user_data')!);
  }
}
