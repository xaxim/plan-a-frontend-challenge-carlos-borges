import { Component, OnInit } from '@angular/core';
import { MovieResponse, MovieService } from '../services/movie.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  page = 1;
  movies: MovieResponse[];

  constructor(public movieService: MovieService) { }

  ngOnInit() {
    this.getPopularMovies();
  }

  public loadNextMovies(event) {
    this.page++;
    this.movieService.getPopularMovies(this.page).subscribe(
      response => {
        this.movies = this.movies.concat(response.results);
      },
      error => console.error(error),
      () => {
        event.target.complete();
      });
  }

  private getPopularMovies() {
    this.movieService.getPopularMovies(this.page).subscribe(response => {
      this.movies = response.results;
    });
  }

}
