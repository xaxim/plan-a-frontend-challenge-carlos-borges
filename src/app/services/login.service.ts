import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

export interface Credentials {
  email: string;
  password: string;
}

/* eslint-disable @typescript-eslint/naming-convention */
export interface TokenResponse {
  success: boolean;
  expires_at: string;
  request_token: string;
  status_message: string;
  status_code: number;
}
/* eslint-enable @typescript-eslint/naming-convention */

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {

  public loginToken: string;

  subs: Subscription[];

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.cancel();
  }

  public login(credentials: Credentials) {
    const BASE_API = 'https://api.themoviedb.org/3';
    const API_KEY = '8a732f489f66fcfb6feee9839dc02d76';
    const FIXED_USERNAME = 'planatest';
    const FIXED_PASSWORD = '123456';
    const createTokenURL = `${BASE_API}/authentication/token/new?api_key=${API_KEY}`;
    const validateWithLoginURL = `${BASE_API}/authentication/token/validate_with_login?api_key=${API_KEY}`;
    this.http.get(createTokenURL).subscribe((newTokenResponse: TokenResponse) => {
      this.http.post(
        validateWithLoginURL,
        {
          username: FIXED_USERNAME,
          password: FIXED_PASSWORD,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          request_token: newTokenResponse.request_token
        })
        .subscribe((validateWithLoginResponse: TokenResponse) => {
          if (validateWithLoginResponse.success) {
            this.router.navigate(['/home']);
            //TODO: Store email, password and token
          }
        });
    });

  }

  public cancel() {
    this.loginToken = null;
    this.subs?.forEach(sub => {
      sub?.unsubscribe();
    });
  }
}
