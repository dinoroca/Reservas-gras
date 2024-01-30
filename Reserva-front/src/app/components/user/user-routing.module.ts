import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { DatosComponent } from './perfil/datos/datos.component';
import { ReservasComponent } from './perfil/reservas/reservas.component';
import { ActualizarComponent } from './perfil/actualizar/actualizar.component';
import { UpdatePasswordComponent } from './perfil/update-password/update-password.component';
import { VerGrassComponent } from './ver-grass/ver-grass.component';
import { VerMovilComponent } from './ver-movil/ver-movil.component';
import { PoliticaPrivComponent } from './politica-priv/politica-priv.component';
import { TermCondicionesComponent } from './term-condiciones/term-condiciones.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'nosotros', component: NosotrosComponent},
  {path: 'contacto', component: ContactoComponent},
  {path: 'politica-privacidad', component: PoliticaPrivComponent},
  {path: 'terminos-condiciones', component: TermCondicionesComponent},
  {path: 'perfil', component: DatosComponent},
  {path: 'perfil/reservas', component: ReservasComponent},
  {path: 'ver/:id', component: VerGrassComponent},
  {path: 'ver-movil/:id', component: VerMovilComponent},
  {path: 'perfil/actualizar', component: ActualizarComponent},
  {path: 'perfil/update-password', component: UpdatePasswordComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
