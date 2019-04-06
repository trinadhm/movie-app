import { makeAjax, getStoredData } from '../utilities/functions';
import config from './config';
import collectionService from './collections';

const saveToLocalStorage = (results, searchTerm, conf) => {
  // Mutation here -- Internal to function
  const dataToStore = getStoredData(conf.results_storage);

  if (!dataToStore[searchTerm]) {
    dataToStore[searchTerm] = {};
  }

  dataToStore[searchTerm][results.page] = results;
  localStorage.setItem(conf.results_storage, JSON.stringify(dataToStore));
};

const _addListToMovies = (resultData) => {
  const collectionMap = collectionService.getCollectionMap();
  const resultSet = resultData.results.map((mov) => {
    if (collectionMap[mov.id]) {
      return { ...mov, list: collectionMap[mov.id] };
    }
    return { ...mov, list: false };
  });
  const finResults = { ...resultData, results: resultSet };
  return finResults;
};

const _getPopular = conf => (page) => {
  const pge = page || 1;

  return new Promise((resolve, reject) => {
    const url = Object.keys(conf.search_params).reduce((acc, key) => `${acc}&${key}=${conf.search_params[key]}`, `${conf.discover_path}?api_key=${conf.api_key}&sort_by=popularity.desc&page=${pge}`);
    const fetchResults = makeAjax(url, 'GET', {});
    fetchResults.then((data) => {
      const resultData = JSON.parse(data);
      const finResults = _addListToMovies(resultData);
      resolve(finResults);
    }).catch((err) => {
      reject(err);
    });
  });
};

const _searchMovie = conf => (searchTerm, page) => {
  // console.log(searchTerm);
  const pge = page || 1;
  return new Promise((resolve, reject) => {
    const dataToStore = getStoredData(conf.results_storage);
    if (dataToStore[searchTerm] && dataToStore[searchTerm][pge]) {
      const resData = _addListToMovies(dataToStore[searchTerm][pge]);
      resolve(resData);
    } else {
      const url = Object.keys(conf.search_params).reduce((acc, key) => `${acc}&${key}=${conf.search_params[key]}`, `${conf.search_path}?api_key=${conf.api_key}&query=${searchTerm}&page=${pge}`);
      const fetchResults = makeAjax(url, 'GET', {});
      fetchResults.then((data) => {
        const resultData = JSON.parse(data);
        const finResults = _addListToMovies(resultData);
        saveToLocalStorage(finResults, searchTerm, conf);
        resolve(finResults);
      }).catch((err) => {
        reject(err);
      });
    }
  });
};

const _getMoviesForList = moviesPerPage => (listName, pge) => {
  const pgeNo = pge || 1;
  const moviesLocal = collectionService.getMoviesFromLocal();
  const moviesCollections = collectionService.getMovieMapFromLocal();
  const moviesInColleciton = moviesCollections[listName];
  const movies = moviesInColleciton.map(item => ((moviesLocal[item]) ? moviesLocal[item] : {}));

  const moviesToShow = movies.slice(moviesPerPage * (pgeNo - 1), moviesPerPage * pgeNo);
  const totalPages = Math.ceil(movies.length / moviesPerPage);
  // console.log('Movies:: ', moviesToShow);

  return {
    value: moviesToShow,
    pageCount: totalPages,
    currentPage: pgeNo,
  };
};

export const searchMovie = _searchMovie({ ...config }); // Currying
export const getMoviesForList = _getMoviesForList(config.moviesPerPage);
export const getPopular = _getPopular({ ...config });
