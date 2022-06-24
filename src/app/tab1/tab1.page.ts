import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { MovieResponse, MovieService } from '../services/movie.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  movieDisplayed: MovieResponse;
  posterURL: string;

  constructor(
    private loginService: LoginService,
    private movieService: MovieService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.displayLatest();
  }

  displayLatest() {
    this.movieService.getLatestMovie().subscribe(latest => {
      this.movieDisplayed = latest;
      if (!latest.adult) {
        this.posterURL = this.movieService.getMoviePoster(this.movieDisplayed);
      }
    });
  }

  displayMostPopular() {
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
