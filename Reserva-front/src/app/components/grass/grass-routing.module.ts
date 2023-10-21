import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { CanchasComponent } from './canchas/canchas.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'canchas', component: CanchasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrassRoutingModule { }
