import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

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

  subs: Subscription[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
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
    const newTokenSubscription = this.http.get(createTokenURL).subscribe((newTokenResponse: TokenResponse) => {
      const validationSubscription = this.http.post(
        validateWithLoginURL,
        {
          username: FIXED_USERNAME,
          password: FIXED_PASSWORD,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          request_token: newTokenResponse.request_token
        })
        .subscribe(async (validateWithLoginResponse: TokenResponse) => {
          if (validateWithLoginResponse?.success) {
            this.router.navigate(['/home']);
            this.storage.set(
              'currentUser',
              {
                email: credentials.email,
                password: credentials.password,
                token: validateWithLoginResponse.request_token
              });
          }
        });
      this.subs.push(validationSubscription);
    });
    this.subs.push(newTokenSubscription);
  }

  public cancel() {
    this.subs?.forEach(sub => {
      sub?.unsubscribe();
    });
  }
}
