import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { NavComponent } from './nav/nav.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { DatosComponent } from './perfil/datos/datos.component';
import { ReservasComponent } from './perfil/reservas/reservas.component';
import { ActualizarComponent } from './perfil/actualizar/actualizar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { UpdatePasswordComponent } from './perfil/update-password/update-password.component';


@NgModule({
  declarations: [
    InicioComponent,
    NavComponent,
    NosotrosComponent,
    ContactoComponent,
    DatosComponent,
    ReservasComponent,
    ActualizarComponent,
    SidebarComponent,
    UpdatePasswordComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule
  ]
})
export class UserModule { }
