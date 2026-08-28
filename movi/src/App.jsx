import Search from './components/Search'
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard";
import { useState, useEffect } from 'react'
import './App.css'


const API_BASE_URL = 'https://api.themoviedb.org/3/discover/movie'   //tmdb API
const API_KEY = import.meta.env.TMDB_API_KEY
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

  const fetchMovies = async () => {
    setLoading(true);
    setErrorMsg('');

    try {                                                                                     //try
      const response = await fetch(API_BASE_URL, API_METHODS);

      if(!response.ok) throw new Error('Failed to retrieve movie results.');

      const data = await response.json();
      console.log(data);

      if(data.Response === 'False') {
        setErrorMsg(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    }
    catch (error) {                                                                            //catch
      console.log(`Ran into an error while fetching movies: ${error}`);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [])


  return (
      <main>
        <div className='pattern'/>

        <div className='wrapper'>
          <header>
            <img src='./hero.png' alt='Hero Banner'/>
            <h1> Find <span className='text-gradient'>Movies</span> You'll Enjoy Without The Hassle</h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
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

          <h1 className='text-white'>{searchTerm}</h1>
        </div>
      </main>
  )
}

export default App