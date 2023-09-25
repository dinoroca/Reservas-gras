import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyMailComponent } from './verify-mail/verify-mail.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterModule } from '@angular/router';
import { RegisterEmpresaComponent } from './register-empresa/register-empresa.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyMailComponent,
    RegisterEmpresaComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AppRoutingModule,
    RouterModule
  ]
})
export class AuthModule { }
