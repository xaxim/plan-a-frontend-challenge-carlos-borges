import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

/* eslint-disable @typescript-eslint/naming-convention */
export interface MovieResponse {
  adult?: boolean;
  backdrop_path?: string | null;
  belongs_to_collection?: null;
  budget?: number;
  genres?: { id?: number; name?: string }[];
  homepage?: string;
  id?: number;
  imdb_id?: string;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity?: number;
  poster_path?: string | null;
  production_companies?: [];
  production_countries?: [];
  release_date?: string;
  revenue?: number;
  runtime?: number;
  spoken_languages?: [];
  status?: string;
  tagline?: string;
  title?: string;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
  status_message?: string;
  status_code?: number;
}

interface ConfigurationResponse {
  images?: {
    base_url?: string;
    secure_base_url?: string;
    poster_sizes?: string[];
  };
}
/* eslint-enable @typescript-eslint/naming-convention */

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  configuration: ConfigurationResponse;

  constructor(private http: HttpClient, private loginService: LoginService) {
    this.getConfiguration();
  }

  public getMoviePoster(movie: MovieResponse) {
    if (this.configuration?.images?.poster_sizes?.length < 1 || !movie?.poster_path) {
      return null;
    }
    const posterSizes = this.configuration.images.poster_sizes;
    const selectedPosterSize = posterSizes[posterSizes.length - 1];
    return `${this.configuration.images.secure_base_url}${selectedPosterSize}${movie.poster_path}`;
  }

  public getLatestMovie(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.loginService.apiBase}/movie/latest?api_key=${this.loginService.apiKey}&language=en-US`);
  }

  public getPopularMovies(): Observable<{ results: MovieResponse[] }> {
    // eslint-disable-next-line max-len
    return this.http.get<{ results: MovieResponse[] }>(`${this.loginService.apiBase}/movie/popular?api_key=${this.loginService.apiKey}&language=en-US`);
  }

  private getConfiguration() {
    const configurationSub = this.http
      .get<ConfigurationResponse>(`${this.loginService.apiBase}/configuration?api_key=${this.loginService.apiKey}`)
      .subscribe(response => {
        this.configuration = response;
        configurationSub.unsubscribe();
      });
  }
}
