import { Component, OnInit } from '@angular/core';
import {MovieResponse, MovieService} from '../services/movie.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  page = 1;
  movies: MovieResponse[];

  constructor(public movieService: MovieService) { }

  ngOnInit() {
    this.getTopRatedMovies();
  }

  public loadNextMovies(event) {
    this.page++;
    this.movieService.getTopRatedMovies(this.page).subscribe(
      response => {
        this.movies = this.movies.concat(response.results);
      },
      error => console.error(error),
      () => {
        event.target.complete();
      });
  }

  private getTopRatedMovies() {
    this.movieService.getTopRatedMovies(this.page).subscribe(response => {
      this.movies = response.results;
    });
  }
}
