import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { DatosComponent } from './perfil/datos/datos.component';
import { ReservasComponent } from './perfil/reservas/reservas.component';
import { ActualizarComponent } from './perfil/actualizar/actualizar.component';
import { UpdatePasswordComponent } from './perfil/update-password/update-password.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'nosotros', component: NosotrosComponent},
  {path: 'contacto', component: ContactoComponent},
  {path: 'perfil', component: DatosComponent},
  {path: 'perfil/reservas', component: ReservasComponent},
  {path: 'perfil/actualizar', component: ActualizarComponent},
  {path: 'perfil/update-password', component: UpdatePasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
