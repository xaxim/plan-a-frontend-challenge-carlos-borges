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
  showImage = true;

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
      this.posterURL = this.movieService.getMoviePoster(this.movieDisplayed);
      if (latest.adult) {
        this.showImage = false;
      }
      if (!this.posterURL) {
        this.showImage = false;
      }
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleImageVisibility() {
    if (this.posterURL) {
      this.showImage = !this.showImage;
    }
  }

}
