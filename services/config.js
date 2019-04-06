const config = {
  api_key: '3f49e7e1c7d24c5d3c90671d2c124fcd',
  search_path: 'https://api.themoviedb.org/3/search/movie',
  discover_path: 'https://api.themoviedb.org/3/discover/movie',
  search_params: {
    language: 'en-US',
    include_adult: false,
  },
  posterBasePath: 'http://image.tmdb.org/t/p/w342',
  results_storage: 'moviesearch',
  collectionsList: 'collections',
  moviesList: 'movies',
  movieCollectionMap: 'addedmovies',
  collectionMovieMap: 'addedToCollection',
  moviesPerPage: 5,
};

module.exports = config;
