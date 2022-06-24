import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private loginService: LoginService, private router: Router) { }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

}
