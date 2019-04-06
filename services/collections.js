import { getStoredData } from '../utilities/functions';
import {
  collectionsList, moviesList, movieCollectionMap, collectionMovieMap,
} from './config';

const _saveToLocalStorage = key => (list) => {
  localStorage.setItem(key, JSON.stringify(list));
  // console.log('KEY:: ', key);
  // console.log('VALUE:: ', list);
};

const saveCollectionList = _saveToLocalStorage(collectionsList);

const saveMoviesList = _saveToLocalStorage(moviesList);

const saveMovieMap = _saveToLocalStorage(movieCollectionMap);

const saveCollectionMap = _saveToLocalStorage(collectionMovieMap);

const getMoviesFromLocal = () => getStoredData(moviesList);

const getCollectionsListFromLocal = () => getStoredData(collectionsList);

const getMovieMapFromLocal = () => getStoredData(movieCollectionMap);

const getCollectionMap = () => getStoredData(collectionMovieMap);

const addMovieToList = (movie, listName) => {
  // {title, release_date, vote_average, popularity, overview, id, poster_path}
  const movieObj = {
    title: decodeURI(movie.movietitle),
    id: movie.id,
    poster_path: movie.poster,
    release_date: movie.year,
    vote_average: movie.vote,
    overview: decodeURI(movie.desc),
    popularity: movie.popularity,
    list: [listName],
  };
  const movid = movieObj.id;
  const localMov = getMoviesFromLocal();
  if (!localMov[movid]) {
    const obj = { ...localMov };
    obj[movid] = movieObj;
    saveMoviesList(obj);
  } else if (localMov[movid].list.indexOf(listName) < 0) {
    const obj = { ...localMov[movid] };
    obj.list.push(listName);
    saveMoviesList({ ...localMov, obj });
  }

  const movieMap = getMovieMapFromLocal();
  if (!movieMap[listName]) {
    const obj = { ...movieMap };
    obj[listName] = [movid];
    saveMovieMap(obj);
  } else {
    const moviesInList = movieMap[listName];
    if (moviesInList.indexOf(movid) < 0) {
      const obj = { ...movieMap };
      obj[listName] = [...moviesInList, movid];
      saveMovieMap(obj);
    }
  }

  const collectionMap = getCollectionMap();
  if (!collectionMap[movid]) {
    const obj = { ...collectionMap };
    obj[movid] = [listName];
    saveCollectionMap(obj);
  } else {
    const collectionsForMovie = collectionMap[movid];
    if (collectionsForMovie.indexOf(listName) < 0) {
      collectionsForMovie.push(listName);
      const obj = { ...collectionMap };
      obj[movid] = collectionsForMovie;
      saveCollectionMap(obj);
    }
  }
};

const removeMovieFromList = (mov, listName) => {
  const collection = { ...getCollectionMap() };
  collection[mov].splice(collection[mov].indexOf(listName), 1);
  if (collection[mov].length === 0) {
    delete collection[mov];
  }
  saveCollectionMap(collection);

  const movieMap = { ...getMovieMapFromLocal() };
  movieMap[listName].splice(movieMap[listName].indexOf(mov), 1);
  if (movieMap[listName].length === 0) {
    delete movieMap[listName];
  }
  saveMovieMap(movieMap);

  const movieList = { ...getMoviesFromLocal() };
  movieList[mov].list.splice(movieList[mov].list.indexOf(listName), 1);
  saveMoviesList(movieList);
  return movieList;
};

const collectionService = {
  getMoviesFromLocal,
  getCollectionsListFromLocal,
  getMovieMapFromLocal,
  saveMovieMap,
  saveMoviesList,
  saveCollectionList,
  addMovieToList,
  saveCollectionMap,
  getCollectionMap,
  removeMovieFromList,
};

module.exports = collectionService;
