import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { IndexCuentasComponent } from './cuentas/index-cuentas/index-cuentas.component';
import { IndexDatosComponent } from './datos/index-datos/index-datos.component';
import { EditDatosComponent } from './datos/edit-datos/edit-datos.component';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';
import { IndexCanchasComponent } from './canchas/index-canchas/index-canchas.component';
import { CreateCanchasComponent } from './canchas/create-canchas/create-canchas.component';
import { EditCanchasComponent } from './canchas/edit-canchas/edit-canchas.component';
import { CreateCuentasComponent } from './cuentas/create-cuentas/create-cuentas.component';
import { EditCuentasComponent } from './cuentas/edit-cuentas/edit-cuentas.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'canchas', component: IndexCanchasComponent},
  {path: 'canchas/crear', component: CreateCanchasComponent},
  {path: 'canchas/:id', component: EditCanchasComponent},
  {path: 'caracteristicas', component: CaracteristicasComponent},
  {path: 'datos', component: IndexDatosComponent},
  {path: 'datos/actualizar', component: EditDatosComponent},
  {path: 'reservaciones', component: ReservacionesComponent},
  {path: 'cuentas', component: IndexCuentasComponent},
  {path: 'cuentas/crear', component: CreateCuentasComponent},
  {path: 'cuentas/:id', component: EditCuentasComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrassRoutingModule { }
