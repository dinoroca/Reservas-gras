import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrassRoutingModule } from './grass-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
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


@NgModule({
  declarations: [
    InicioComponent,
    SidebarComponent,
    NavComponent,
    ReservacionesComponent,
    IndexCuentasComponent,
    CreateCuentasComponent,
    EditCuentasComponent,
    IndexDatosComponent,
    EditDatosComponent,
    CaracteristicasComponent,
    IndexCanchasComponent,
    CreateCanchasComponent,
    EditCanchasComponent,
    GaleriaCanchasComponent
  ],
  imports: [
    CommonModule,
    GrassRoutingModule,
    FormsModule
  ]
})
export class GrassModule { }
