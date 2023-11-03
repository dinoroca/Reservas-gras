import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { CanchasComponent } from './canchas/canchas.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { IndexCuentasComponent } from './cuentas/index-cuentas/index-cuentas.component';
import { IndexDatosComponent } from './datos/index-datos/index-datos.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'canchas', component: CanchasComponent},
  {path: 'datos', component: IndexDatosComponent},
  {path: 'reservaciones', component: ReservacionesComponent},
  {path: 'cuentas', component: IndexCuentasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrassRoutingModule { }
