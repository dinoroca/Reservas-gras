import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { CanchasComponent } from './canchas/canchas.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { IndexCuentasComponent } from './cuentas/index-cuentas/index-cuentas.component';
import { IndexDatosComponent } from './datos/index-datos/index-datos.component';
import { EditDatosComponent } from './datos/edit-datos/edit-datos.component';
import { CaracteristicasComponent } from './caracteristicas/caracteristicas.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'canchas', component: CanchasComponent},
  {path: 'caracteristicas', component: CaracteristicasComponent},
  {path: 'datos', component: IndexDatosComponent},
  {path: 'datos/actualizar', component: EditDatosComponent},
  {path: 'reservaciones', component: ReservacionesComponent},
  {path: 'cuentas', component: IndexCuentasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrassRoutingModule { }
