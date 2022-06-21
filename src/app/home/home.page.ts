
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MovieResponse, MovieService } from '../services/movie.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  movieDisplayed: MovieResponse;
  posterURL: string;
  latest = true;

  constructor(
    private loginService: LoginService,
    private movieService: MovieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.displayLatest();
  }

  displayLatest() {
    this.latest = true;
    this.movieService.getLatestMovie().subscribe(latest => {
      this.movieDisplayed = latest;
      this.posterURL = this.movieService.getMoviePoster(this.movieDisplayed);
    });
  }

  displayMostPopular() {
    this.latest = false;
    this.movieService.getPopularMovies().subscribe(popularList => {
      this.movieDisplayed = popularList.results[0];
      this.posterURL = this.movieService.getMoviePoster(this.movieDisplayed);
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

}
