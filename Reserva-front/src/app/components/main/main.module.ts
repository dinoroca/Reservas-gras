import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactosComponent } from './contactos/contactos.component';
import { PoliticaPrivComponent } from './politica-priv/politica-priv.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    HomeComponent,
    NosotrosComponent,
    ContactosComponent,
    PoliticaPrivComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class MainModule { }
