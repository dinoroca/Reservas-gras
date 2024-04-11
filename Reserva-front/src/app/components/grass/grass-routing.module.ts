import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { IndexCuentasComponent } from './cuentas/index-cuentas/index-cuentas.component';
import { IndexDatosComponent } from './datos/index-datos/index-datos.component';
import { EditDatosComponent } from './datos/edit-datos/edit-datos.component';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';
import { IndexCanchasComponent } from './canchas/index-canchas/index-canchas.component';
import { CreateCanchasComponent } from './canchas/create-canchas/create-canchas.component';
import { EditCanchasComponent } from './canchas/edit-canchas/edit-canchas.component';
import { CreateCuentasComponent } from './cuentas/create-cuentas/create-cuentas.component';
import { EditCuentasComponent } from './cuentas/edit-cuentas/edit-cuentas.component';
import { GaleriaCanchasComponent } from './canchas/galeria-canchas/galeria-canchas.component';
import { IndexResComponent } from './reservaciones/index-res/index-res.component';
import { CreateResComponent } from './reservaciones/create-res/create-res.component';
import { CrearResIdComponent } from './reservaciones/crear-res-id/crear-res-id.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ContactarComponent } from './contactar/contactar.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { SuscripcionComponent } from './suscripcion/suscripcion.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'canchas', component: IndexCanchasComponent},
  {path: 'canchas/crear', component: CreateCanchasComponent},
  {path: 'canchas/:id', component: EditCanchasComponent},
  {path: 'canchas/galeria/:id', component: GaleriaCanchasComponent},
  {path: 'caracteristicas', component: CaracteristicasComponent},
  {path: 'datos', component: IndexDatosComponent},
  {path: 'datos/actualizar', component: EditDatosComponent},
  {path: 'suscripcion', component: SuscripcionComponent},
  {path: 'reservaciones', component: IndexResComponent},
  {path: 'reservaciones/crear', component: CreateResComponent},
  {path: 'reservaciones/crear/:id', component: CrearResIdComponent},
  {path: 'cuentas', component: IndexCuentasComponent},
  {path: 'cuentas/crear', component: CreateCuentasComponent},
  {path: 'cuentas/:id', component: EditCuentasComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'contactar', component: ContactarComponent},
  {path: 'ayuda', component: AyudaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrassRoutingModule { }
