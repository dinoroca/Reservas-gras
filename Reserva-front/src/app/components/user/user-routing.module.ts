import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'perfil', component: PerfilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
