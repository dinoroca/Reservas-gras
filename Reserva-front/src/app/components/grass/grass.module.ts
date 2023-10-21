import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrassRoutingModule } from './grass-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { CanchasComponent } from './canchas/canchas.component';


@NgModule({
  declarations: [
    InicioComponent,
    CanchasComponent
  ],
  imports: [
    CommonModule,
    GrassRoutingModule
  ]
})
export class GrassModule { }
