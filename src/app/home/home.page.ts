
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MovieResponse, MovieService } from '../services/movie.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  latest: MovieResponse;
  posterURL: string;

  constructor(
    private loginService: LoginService,
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.movieService.getLatestMovie().subscribe(latest => {
      this.latest = latest;
      this.posterURL = this.movieService.getMoviePoster(latest);
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

}
