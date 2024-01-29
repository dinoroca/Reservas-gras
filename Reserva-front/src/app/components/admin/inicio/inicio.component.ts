import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  public token: any;
  public chart: any;
  public cantidad = 0;
  public ganancia_total = 0;
  public total_mes = 0;
  public total = 0;
  public total_mes_anterior = 0;
  public total_mes_sim = 0;
  public total_mes_anterior_sim = 0;
  public count_ventas = 0;
  public load_data = true;

  constructor(
    private _title: Title,
    private _userService: UserService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  ngOnInit(): void {
    this._title.setTitle('ADMIN | Inicio');
    this.init_data();
  }

  init_data() {
    this._userService.kpi_ganancias_mensuales_admin(this.token).subscribe(
      response => {
        this.ganancia_total = response.ganancia_total;
        this.total_mes = response.total_mes;
        this.total = response.total;
        this.total_mes_anterior = response.total_mes_anterior;
        this.count_ventas = response.count_ventas;
        this.chart = new Chart("MyChart", {
          type: 'line', //this denotes tha type of chart

          data: {// values on X-Axis
            labels: ['Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'Diciembre'],
            datasets: [
              {
                label: "Comisiones en S/.",
                data: [response.enero,
                response.febrero,
                response.marzo,
                response.abril,
                response.mayo,
                response.junio,
                response.julio,
                response.agosto,
                response.septiembre,
                response.octubre,
                response.noviembre,
                response.diciembre],
                backgroundColor: 'rgb(111, 66, 192)',
                borderColor: 'rgb(158, 107, 255)',
                tension: 0.4
              }
            ]
          },
          options: {
            aspectRatio: 2
          }
          
        });
        
        this.load_data = false;
      }
    );

  }

}

