import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import css from './App.module.css';

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

const { data, isLoading, isError } = useQuery<FetchMoviesResponse>({
  queryKey: ['movies', query, page],
  queryFn: () => fetchMovies(query, page),
  enabled: !!query,
});

  const handleSearch = (newQuery: string) => {
    const trimmed = newQuery.trim();
    if (!trimmed) return;

    setQuery(trimmed);
    setPage(1); 
  };

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data?.results.length === 0 && <p>Нічого не знайдено.</p>}

      {data && data.results.length === 0 && <p>Нічого не знайдено.</p>}

{data && data.results.length > 0 && (
  <>
    <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
    {data.total_pages > 1 && (
      <ReactPaginate
        pageCount={data.total_pages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => setPage(selected + 1)}
        forcePage={page - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />
    )}
  </>
)}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}
