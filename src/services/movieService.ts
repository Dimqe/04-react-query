import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  query: string,
  page: number = 1
): Promise<MovieResponse> => {
  const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

  const response = await axios.get<MovieResponse>(BASE_URL, {
    params: { query, page },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });

  return response.data;
};