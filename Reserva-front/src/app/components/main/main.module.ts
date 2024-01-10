import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactosComponent } from './contactos/contactos.component';
import { PoliticaPrivComponent } from './politica-priv/politica-priv.component';
import { SharedModule } from '../shared/shared.module';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterModule } from '@angular/router';
import { VerGrassComponent } from './ver-grass/ver-grass.component';
import { VerMovilComponent } from './ver-movil/ver-movil.component';

@NgModule({
  declarations: [
    HomeComponent,
    NosotrosComponent,
    ContactosComponent,
    PoliticaPrivComponent,
    ForgotPassComponent,
    VerGrassComponent,
    VerMovilComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AppRoutingModule,
    RouterModule
  ]
})
export class MainModule { }
