import "vite/client";
import {computed, makeAutoObservable, runInAction} from 'mobx';
import {IMovie, SortDirection, SortField} from "../types/types";

class MovieStore {
    movies: IMovie[] = [];

    page: number = 1;
    totalPages: number = 1;
    isLoading: boolean = false;

    searchQuery: string = 'silicon valley';

    favoriteIds: string[] = [];
    favoriteMovies: IMovie[] = [];

    filterType: string = 'all';
    filterYear: string = '';

    sortField: SortField = 'none';
    sortDirection: SortDirection = 'asc';

    constructor() {
        makeAutoObservable(this, {
            filteredAndSortedMovies: computed,
        });

        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            this.favoriteIds = JSON.parse(savedFavorites);
            console.log({ favoriteIds: this.favoriteIds });
        }
    }

    async fetchMovies() {
        try {
            this.isLoading = true;
            const apiKey = import.meta.env.VITE_OMDB_API_KEY;

            const response = await fetch(
                `http://www.omdbapi.com/?apikey=${apiKey}&s=${this.searchQuery}&page=${this.page}`
            );
            const data = await response.json();

            if (data.Response === 'True' && Array.isArray(data.Search)) {
                const newMovies: IMovie[] = data.Search.map((item: any) => ({
                    id: item.imdbID,
                    title: item.Title,
                    year: item.Year,
                    type: item.Type,
                    poster: item.Poster,
                }));

                runInAction(() => {
                    this.movies = [...this.movies, ...newMovies];
                    const totalResults = parseInt(data.totalResults, 10) || 0;
                    this.totalPages = Math.ceil(totalResults / 10);
                    this.page += 1;
                });
            } else {
                runInAction(() => {
                    this.totalPages = 0;
                });
            }
        } catch (error) {
            console.error('Failed to fetch movies from OMDb:', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async fetchMovieById(imdbID: string): Promise<IMovie | null> {
        try {
            const apiKey = import.meta.env.VITE_OMDB_API_KEY;
            const response = await fetch(
                `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=short`
            );
            const data = await response.json();

            if (data.Response === 'True') {
                return {
                    id: data.imdbID,
                    title: data.Title,
                    year: data.Year,
                    type: data.Type,
                    poster: data.Poster,
                };
            } else {
                console.error('OMDb responded with an error:', data.Error);
                return null;
            }
        } catch (error) {
            console.error('Failed to fetch movie details', error);
            return null;
        }
    }

    async fetchFavoriteMovies() {
        const idsToFetch = this.favoriteIds;

        if (idsToFetch.length === 0) {
            return;
        }

        const promises: Promise<IMovie|null>[] = idsToFetch.map((id) => this.fetchMovieById(id));
        const results: (IMovie|null)[] = await Promise.all(promises);

        const newMovies = results.filter((m) => m) as IMovie[];
        const existingIds = new Set(this.favoriteMovies.map((f) => f.id));
        const unique = newMovies.filter((m) => !existingIds.has(m.id));

        if (newMovies.length > 0) {
            runInAction(() => {
                this.favoriteMovies = [...this.favoriteMovies, ...unique];
            });
        }
    }

    get filteredAndSortedMovies(): IMovie[] {
        let result = this.movies.filter((movie) => {
            if (this.filterType !== 'all' && movie.type !== this.filterType) {
                return false;
            }
            return !(this.filterYear && movie.year !== this.filterYear);

        });

        if (this.sortField !== 'none') {
            result = result.slice();
            result.sort((a, b) => {
                let valA: string | number = '';
                let valB: string | number = '';

                switch (this.sortField) {
                    case 'title':
                        valA = a.title;
                        valB = b.title;
                        break;
                    case 'year':
                        valA = parseInt(a.year, 10) || 0;
                        valB = parseInt(b.year, 10) || 0;
                        break;
                    case 'type':
                        valA = a.type;
                        valB = b.type;
                        break;
                }

                if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
                if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }

    toggleFavorite(movieId: string) {
        if (this.favoriteIds.includes(movieId)) {
            this.favoriteIds = this.favoriteIds.filter((id) => id !== movieId);
            this.favoriteMovies = this.favoriteMovies.filter((m) => m.id !== movieId);

        } else {
            this.favoriteIds.push(movieId);
        }

        localStorage.setItem('favorites', JSON.stringify(this.favoriteIds));
    }

    isFavorite(movieId: string): boolean {
        return this.favoriteIds.includes(movieId);
    }

    setFilterType(type: string) {
        this.filterType = type;
    }

    setFilterYear(year: string) {
        this.filterYear = year;
    }
    setSortField(field: SortField) {
        this.sortField = field;
    }

    setSortDirection(direction: SortDirection) {
        this.sortDirection = direction;
    }

    deleteMovie(id: string) {
        this.movies = this.movies.filter((movie) => movie.id !== id);
    }

    editMovie(id: string, newTitle: string) {
        this.movies = this.movies.map((movie) =>
            movie.id === id
                ? { ...movie, title: newTitle, isLocallyEdited: true }
                : movie
        );
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
        this.resetMovies();
    }

    resetMovies() {
        this.movies = [];
        this.page = 1;
        this.totalPages = 1;
    }
}

export const movieStore = new MovieStore();


