import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilComponent } from './perfil/perfil.component';


@NgModule({
  declarations: [
    InicioComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
