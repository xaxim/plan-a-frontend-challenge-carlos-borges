import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isLoggingIn = false;
  passwordVisible = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    public loginService: LoginService
  ) { }

  ngOnInit() {
  }

  async login() {
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    this.loginService.login({ email, password });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  cancelLogin() {
    this.loginService.cancel();
  }

}
