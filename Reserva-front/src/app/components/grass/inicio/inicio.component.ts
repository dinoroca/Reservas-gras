import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { GLOBAL } from '../../../services/global';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  public empresa: any = {};
  public chart: any;
  public cantidad = 0;
  public total_ventas = 0;
  public total_mes = 0;
  public total_mes_anterior = 0;
  public total_mes_sim = 0;
  public total_mes_anterior_sim = 0;
  public count_ventas = 0;
  public load_data = true;
  public id: any;
  public token: any;
  public load_btn = false;
  public isImagePort = false;
  public addImage = true;
  public url: any;
  public load_btn_eliminar = false;
  public file: File | any = undefined;

  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.url = GLOBAL.url;

    this.init_data();
  }

  init_data() {
    this.load_data = true;
    this._userService
      .obtener_empresa(this.id, this.token)
      .subscribe((response) => {
        if (response.data == undefined) {
          this.empresa = undefined;
          this.load_data = false;
        } else {
          this.empresa = response.data;

          if (this.empresa.portada) {
            if (this.empresa.portada.length >= 1) {
              this.isImagePort = true;
              this.addImage = false;
            } else {
              this.isImagePort = false;
              this.addImage = true;
            }
          } else {
            this.isImagePort = false;
            this.addImage = true;
          }

          this.load_data = false;
        }
      });
  }

  init_chart() {
    this._userService.kpi_ganancias_mensuales_grass(this.id, this.token).subscribe(
      response => {
        this.total_ventas = response.total_ventas;
        this.total_mes = response.total_mes;
        this.total_mes_anterior = response.total_mes_anterior;
        this.count_ventas = response.count_ventas;
        console.log(response.reservacionesPorCancha);
        
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
                label: "Pagos en S/.",
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
                backgroundColor: 'rgb(20, 203, 139)'
              },
              {
                label: "Pagos en S/.",
                data: [response.enero+3,
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
                backgroundColor: 'rgb(20, 203, 139)'
              }
            ]
          },
          options: {
            aspectRatio: 2
          }

        });

      }
    );
    
    this.load_data = false;
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Galería de canchas');
    this.init_chart();
  }
  //--------------------------------------------------------------
  fileChangeEvent(event: any): void {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      this.showErrorMessage('No hay imagen en el envío');
      return;
    }

    if (file.size > 4000000) {
      this.showErrorMessage('La imagen no debe ser mayor a 4MB');
      return;
    }

    if (
      ![
        'image/png',
        'image/webp',
        'image/jpg',
        'image/jpeg',
        'image/gif',
      ].includes(file.type)
    ) {
      this.showErrorMessage('El archivo debe ser una imagen');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    this.file = file;

    if (file) {
      // Convierte el archivo en una URL de datos (data URL)
      this.convertToBase64(file);
    }
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      // Asigna la URL de datos a la propiedad imagePreview
      this.imagePreview = e.target.result;
    };

    // Lee el contenido del archivo como una URL de datos
    reader.readAsDataURL(file);
  }

  subir_imagen() {
    this.load_btn = true;
    const uuid = uuidv4();

    if (this.file) {
      const data = {
        imagen: this.file,
        _id: uuid,
      };

      this._userService
        .agregar_imagen_portada(this.id, data, this.token)
        .subscribe((response) => {
          this._toastrService.success(
            'Se subió con éxito',
            'PORTADA ACTUALIZADA!'
          );
          this.init_data();
          this.file = undefined;
          this.load_btn = false;
        });
    } else {
      this.showErrorMessage('Debe seleccionar una imagen');
      this.load_btn = false;
    }
  }

  eliminar(id: any) {
    this.load_btn_eliminar = true;
    this._userService
      .eliminar_imagen_portada(this.id, { _id: id }, this.token)
      .subscribe((response) => {
        this._toastrService.success('Se eliminó con éxito', 'ELIMINADO!');
        this.load_btn_eliminar = false;
        this.init_data();
      });
  }

  private showErrorMessage(message: string) {
    this._toastrService.error(message, 'ERROR!');
  }
}
