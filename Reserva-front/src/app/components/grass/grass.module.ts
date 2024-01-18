import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrassRoutingModule } from './grass-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { IndexCuentasComponent } from './cuentas/index-cuentas/index-cuentas.component';
import { CreateCuentasComponent } from './cuentas/create-cuentas/create-cuentas.component';
import { EditCuentasComponent } from './cuentas/edit-cuentas/edit-cuentas.component';
import { IndexDatosComponent } from './datos/index-datos/index-datos.component';
import { EditDatosComponent } from './datos/edit-datos/edit-datos.component';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';
import { IndexCanchasComponent } from './canchas/index-canchas/index-canchas.component';
import { CreateCanchasComponent } from './canchas/create-canchas/create-canchas.component';
import { EditCanchasComponent } from './canchas/edit-canchas/edit-canchas.component';
import { GaleriaCanchasComponent } from './canchas/galeria-canchas/galeria-canchas.component';
import { IndexResComponent } from './reservaciones/index-res/index-res.component';
import { CreateResComponent } from './reservaciones/create-res/create-res.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CrearResIdComponent } from './reservaciones/crear-res-id/crear-res-id.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClientesComponent } from './clientes/clientes.component';


@NgModule({
  declarations: [
    InicioComponent,
    SidebarComponent,
    NavComponent,
    IndexCuentasComponent,
    CreateCuentasComponent,
    EditCuentasComponent,
    IndexDatosComponent,
    EditDatosComponent,
    CaracteristicasComponent,
    IndexCanchasComponent,
    CreateCanchasComponent,
    EditCanchasComponent,
    GaleriaCanchasComponent,
    IndexResComponent,
    CreateResComponent,
    CrearResIdComponent,
    ClientesComponent
  ],
  imports: [
    CommonModule,
    GrassRoutingModule,
    FormsModule,
    QRCodeModule,
    NgxPaginationModule
  ]
})
export class GrassModule { }
