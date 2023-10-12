import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  //USER
  registro_user(data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(this.url + 'registro_user', data, { headers: headers });
  }

  login_user(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_user', data, { headers: headers });
  }

  obtener_user(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'authorization': token });
    return this._http.get(this.url + 'obtener_user/' + id, { headers: headers });
  }

  //EMPRESA
  registro_empresa(data: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(this.url + 'registro_empresa', data, { headers: headers });
  }

  listar_empresas_filtro(filtro: any): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_filtro/' + filtro);
  }

  listar_empresas_region(region: any): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_region/' + region);
  }

  listar_empresas_prov(region: any, provincia: any): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_prov/' + region + '/' + provincia);
  }

  listar_empresas_dist(region: any, provincia: any, distrito: any): Observable<any> {
    return this._http.get(this.url + 'listar_empresas_dist/' + region + '/' + provincia +  '/' + distrito);
  }

  //MENSAJES
  enviar_mensaje_contacto(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'enviar_mensaje_contacto', data, { headers: headers });
  }


  public isAutenticatedUser(): Boolean {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(<any>token);

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }

    return true;
  }

  public isAutenticatedAdmin(): Boolean {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(<any>token);

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }

      if (decodedToken.role !== 'ADMIN') {
        return false;
      }

    } catch (error) {
      localStorage.clear();
      return false;
    }

    if (decodedToken.role == 'ADMIN') {
      return true;
    }

    return true;
  }

  public isAutenticatedGrass(): Boolean {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(<any>token);

      if (helper.isTokenExpired(token)) {
        localStorage.clear();
        return false;
      }

      if (!decodedToken) {
        localStorage.clear();
        return false;
      }

      if (decodedToken.role !== 'GRASS') {
        return false;
      }

    } catch (error) {
      localStorage.clear();
      return false;
    }

    if (decodedToken.role == 'GRASS') {
      return true;
    }

    return true;
  }

}