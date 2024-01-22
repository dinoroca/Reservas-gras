import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { EmpresasComponent } from './empresas/empresas.component';
import { ReservacionesComponent } from './reservaciones/reservaciones.component';
import { IndexCuentasComponent } from './cuentas/index-cuentas/index-cuentas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CreateCuentasComponent } from './cuentas/create-cuentas/create-cuentas.component';
import { EditCuentasComponent } from './cuentas/edit-cuentas/edit-cuentas.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'empresas', component: EmpresasComponent},
  {path: 'reservaciones', component: ReservacionesComponent},
  {path: 'cuentas', component: IndexCuentasComponent},
  {path: 'cuentas/crear', component: CreateCuentasComponent},
  {path: 'cuentas/:id', component: EditCuentasComponent},
  {path: 'clientes', component: UsuariosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
