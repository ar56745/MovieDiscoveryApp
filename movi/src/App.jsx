import Search from './components/Search'
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard";
import { useState, useEffect } from 'react'
import { useDebounce } from "react-use";
import './App.css'
import {updateSearchCount, getTrendingMovies} from "./appwrite.js";

const TABLE_ID = "metrics"  //

const API_BASE_URL = 'https://api.themoviedb.org/3' //tmdb API
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_METHODS = {
  method : 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setSearchTerm]= useState('');
  const [errorMsg, setErrorMsg]= useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce( () => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);  //waits for the user to stop tying for 500 ms, used to prevent making too many API calls

  const fetchMovies = async (query= '') => {
    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`     // if a query exists
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;             // if it doesn't
//try
      const response = await fetch(endpoint, API_METHODS);
      if(!response.ok) throw new Error('Failed to retrieve movie results.');

      const data = await response.json();
      console.log(data);

      // if(data.Response === 'False') {
      //   setErrorMsg(data.Error || 'Failed to fetch movies');
      //   setMovieList([]);
      //   return;
      // }
      setMovieList(data.results || []);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    }
    catch (error) {                                                                            //catch
      console.log(`Ran into an error while fetching movies: ${error}`);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {                             //useEffect
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    loadTrendingMovies();
  }, []);



  return (
      <main>
        <div className="pattern"/>

        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
              <section className="trending">
                <h2>Trending Movies</h2>

                <ul>
                  {trendingMovies.map((movie, index) => (
                      <li key={movie.$id}>
                        <p>{index + 1}</p>
                        <img src={movie.poster_url} alt={movie.title} />
                      </li>
                  ))}
                </ul>
              </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>

            {isLoading ? (
                <Spinner />
            ) : errorMsg ? (
                <p className="text-red-500">{errorMsg}</p>
            ) : (
                <ul>
                  {movieList.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
            )}
          </section>
        </div>
      </main>
  )
}


export default App