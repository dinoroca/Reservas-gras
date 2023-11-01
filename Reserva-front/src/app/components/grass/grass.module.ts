import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrassRoutingModule } from './grass-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { CanchasComponent } from './canchas/canchas.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavComponent } from './nav/nav.component';


@NgModule({
  declarations: [
    InicioComponent,
    CanchasComponent,
    SidebarComponent,
    NavComponent
  ],
  imports: [
    CommonModule,
    GrassRoutingModule
  ]
})
export class GrassModule { }
