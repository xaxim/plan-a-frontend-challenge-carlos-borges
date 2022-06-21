import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

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

  subs: Subscription[] = [];
  isLoggingIn = false;

  public readonly currentUserStorageKey = 'currentUser';
  public readonly apiBase = 'https://api.themoviedb.org/3';
  public readonly apiKey = '8a732f489f66fcfb6feee9839dc02d76';
  private readonly apiUsername = 'planatest';
  private readonly apiPassword = '123456';
  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnDestroy(): void {
    this.cancel();
  }

  public login(credentials: Credentials) {
    this.isLoggingIn = true;
    const createTokenURL = `${this.apiBase}/authentication/token/new?api_key=${this.apiKey}`;
    const validateWithLoginURL = `${this.apiBase}/authentication/token/validate_with_login?api_key=${this.apiKey}`;
    const newTokenSubscription = this.http.get(createTokenURL)
      .subscribe(
        (newTokenResponse: TokenResponse) => {
          const validationSubscription = this.http.post(
            validateWithLoginURL,
            {
              username: this.apiUsername,
              password: this.apiPassword,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              request_token: newTokenResponse.request_token
            })
            .subscribe(
              async (validateWithLoginResponse: TokenResponse) => {
                if (validateWithLoginResponse?.success) {
                  await this.storage.set(
                    this.currentUserStorageKey,
                    {
                      email: credentials.email,
                      password: credentials.password,
                      token: validateWithLoginResponse.request_token
                    });
                  this.router.navigateByUrl('/home');
                }
              },
              error => {
                // TODO: inform error on validate
              },
              () => {
                this.cancel();
              }
            );
          this.subs.push(validationSubscription);
        },
        error => {
          // TODO: inform error on token creation
          this.cancel();
        });
    this.subs.push(newTokenSubscription);
  }

  public cancel() {
    this.isLoggingIn = false;
    this.subs = this.subs
      .map(sub => {
        sub?.unsubscribe();
        return sub;
      })
      .filter(sub => !sub.closed);
  }

  public logout() {
    this.cancel();
    this.storage.remove(this.currentUserStorageKey);
  }
}
