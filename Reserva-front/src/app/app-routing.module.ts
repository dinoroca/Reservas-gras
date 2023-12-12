import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/main/home/home.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NosotrosComponent } from './components/main/nosotros/nosotros.component';
import { ContactosComponent } from './components/main/contactos/contactos.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PoliticaPrivComponent } from './components/main/politica-priv/politica-priv.component';
import { RegisterEmpresaComponent } from './components/auth/register-empresa/register-empresa.component';
import { VerifyMailComponent } from './components/auth/verify-mail/verify-mail.component';
import { WaitComponent } from './components/auth/wait/wait.component';
import { ForgotPassComponent } from './components/main/forgot-pass/forgot-pass.component';
import { AuthUserGuard } from './guards/auth-user.guard';
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthGrassGuard } from './guards/auth-grass.guard';
import { VerGrassComponent } from './components/main/ver-grass/ver-grass.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register_empresa', component: RegisterEmpresaComponent},
  {path: 'registro', component: RegisterComponent},
  {path: 'nosotros', component: NosotrosComponent},
  {path: 'contacto', component: ContactosComponent},
  {path: 'verificar', component: VerifyMailComponent},
  {path: 'wait', component: WaitComponent},
  {path: 'ver/:id', component: VerGrassComponent},
  {path: 'forgot-password', component: ForgotPassComponent},
  {path: 'politica-privacidad', component: PoliticaPrivComponent},

  //Lazy load de modulo de usuario
  {
    path: 'usuario',
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule),
    canActivate: [AuthUserGuard]
  },

  //Lazy load de modulo de ADMIN
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthAdminGuard]
  },

  //Lazy load de modulo de GRASS
  {
    path: 'grass',
    loadChildren: () => import('./components/grass/grass.module').then(m => m.GrassModule),
    canActivate: [AuthGrassGuard]
  },

  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
