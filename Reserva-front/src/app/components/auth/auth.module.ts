import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyMailComponent } from './verify-mail/verify-mail.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyMailComponent
  ],
  imports: [
    CommonModule
  ]
})
export class AuthModule { }
