import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { IndexCuentasComponent } from './cuentas/index-cuentas/index-cuentas.component';
import { CreateCuentasComponent } from './cuentas/create-cuentas/create-cuentas.component';
import { EditCuentasComponent } from './cuentas/edit-cuentas/edit-cuentas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormsModule } from '@angular/forms';
import { MensajesComponent } from './mensajes/mensajes.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    InicioComponent,
    NavComponent,
    SidebarComponent,
    EmpresasComponent,
    ReservacionesComponent,
    IndexCuentasComponent,
    CreateCuentasComponent,
    EditCuentasComponent,
    UsuariosComponent,
    MensajesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class AdminModule { }
