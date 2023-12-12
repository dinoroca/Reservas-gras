import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { GLOBAL } from '../../../services/global';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  public empresa: any = {};
  public id: any;
  public token: any;
  public load_data = true;
  public load_btn = false;
  public isImagePort = false;
  public addImage = true;
  public url: any;
  public load_btn_eliminar = false;
  public file: File | any = undefined;

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
    this._userService.obtener_empresa(this.id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.empresa = undefined;
          this.load_data = false;
        } else {
          this.empresa = response.data;

          if (this.empresa.portada.length >= 1) {
            this.isImagePort = true;
            this.addImage = false;
          } else {
            this.isImagePort = false;
            this.addImage = true;
          }

          this.load_data = false;
        }
      }
    );
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Galería de canchas');
  }

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
      !['image/png', 'image/webp', 'image/jpg', 'image/jpeg', 'image/gif'].includes(file.type)
    ) {
      this.showErrorMessage('El archivo debe ser una imagen');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    this.file = file;
  }

  subir_imagen() {
    this.load_btn = true;
    const uuid = uuidv4();

    if (this.file) {
      const data = {
        imagen: this.file,
        _id: uuid
      };

      this._userService.agregar_imagen_portada(this.id, data, this.token).subscribe(
        response => {
          this._toastrService.success('Se subió con éxito', 'SUBIDO!');
          this.init_data();
          this.file = undefined;
          this.load_btn = false;
        }
      );
    } else {
      this.showErrorMessage('Debe seleccionar una imagen');
      this.load_btn = false;
    }
  }

  eliminar(id: any) {
    this.load_btn_eliminar = true;
    this._userService.eliminar_imagen_portada(this.id, { _id: id }, this.token).subscribe(
      response => {
        this._toastrService.success('Se eliminó con éxito', 'ELIMINADO!');
        this.load_btn_eliminar = false;
        this.init_data();
      }
    );
  }

  private showErrorMessage(message: string) {
    this._toastrService.error(message, 'ERROR!');
  }
}
