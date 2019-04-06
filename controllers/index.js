import { searchMovie, getMoviesForList, getPopular } from '../services/searchMovies';
import store from '../utilities/appStore';
import {
  moviesList,
  pagination,
  getCollectionsListHtml,
  getCollectionMenu,
} from '../renders';
import collectionService from '../services/collections';
import { getParent } from '../utilities/functions';

function getPopularMovies(pge) {
  getPopular(pge).then((data) => {
    store.dispatch({
      type: 'POPUPULAR_CONTENT_DISPLAY',
      searchResults: data,
    });
  });
}

function searchForMovie(term, page) {
  searchMovie(term, page).then((data) => {
    store.dispatch({
      type: 'SEARCH_COMPLETE',
      searchResults: data,
    });
  }).catch((err) => {
    console.log(err);
  });
}

function processListToStorage(list) {
  collectionService.saveCollectionList(list);
}

function getUpdatedMovies() {
  const storeData = { ...store.getState() };
  if (storeData.selectedList) {
    return { ...getMoviesForList(storeData.selectedList, storeData.currPge) };
  }

  if (storeData.searchTerm) {
    searchForMovie(storeData.searchTerm, storeData.currPge);
  } else {
    getPopularMovies(storeData.currPge);
  }
  return false;
}

const init = (document, window) => {
  const compareResults = new WeakMap();
  const compareList = new WeakMap();

  window.addEventListener('load', () => {
    const temp = collectionService.getCollectionsListFromLocal();
    const initCollectionList = (Array.isArray(temp) && temp.length > 0) ? temp : ['Favourites'];
    store.dispatch({
      type: 'INIT_COLLECTION_LIST',
      data: initCollectionList,
    });
    getPopularMovies();
  });

  document.querySelector('#navsearch').addEventListener('submit', (evt) => {
    evt.preventDefault();
    const searchTerm = evt.target.movie.value;
    searchForMovie(searchTerm);
    store.dispatch({
      type: 'SEARCH_START',
      searchTerm,
    });
  });

  document.querySelector('#pagination').addEventListener('click', (evt) => {
    evt.preventDefault();
    // console.log(evt.target.getAttribute('href'));
    const { searchTerm } = { ...store.getState() };
    const pgeNo = parseInt(evt.target.getAttribute('href').slice(1), 10);
    if (!searchTerm) {
      const listName = store.getState().selectedList;
      if (!listName) {
        getPopularMovies(pgeNo);
      } else {
        const movies = getMoviesForList(listName, pgeNo);
        store.dispatch({
          ...movies,
          type: 'MOVIES_FOR_SELECTED_LIST',
        });
      }
    } else {
      searchForMovie(searchTerm, pgeNo);
      store.dispatch({
        type: 'SEARCH_START',
        searchTerm,
      });
    }
  });

  document.querySelector('#resultContainer').addEventListener('keyup', (evt) => {
    if (evt.target.className.search('add-to-list') >= 0 && evt.code === 'Enter') {
      store.dispatch({
        type: 'CUSTOM_LIST_ITEM',
        val: evt.target.value,
      });

      const movie = getParent(evt.target, 'row').querySelector('.mov-details').dataset;
      const listName = evt.target.value;
      collectionService.addMovieToList(movie, listName);
      getUpdatedMovies();
    }
  });

  document.querySelector('#resultContainer').addEventListener('change', (evt) => {
    if (evt.target.className.search('add-to-list') >= 0) {
      store.dispatch({
        type: 'CUSTOM_LIST_ITEM',
        val: evt.target.value,
      });
      const movie = getParent(evt.target, 'row').querySelector('.mov-details').dataset;
      const listName = evt.target.value;
      // console.log('CHANGE::', movie);
      collectionService.addMovieToList(movie, listName);
      getUpdatedMovies();
    }
  });


  document.querySelector('.collection-menu').addEventListener('click', (evt) => {
    if (evt.target.className.search('dropdown-item') >= 0) {
      // evt.preventDefault();
      const listName = evt.target.getAttribute('href').slice(1);

      store.dispatch({
        type: 'LIST_ITEM_SELECTED',
        value: listName,
      });

      const movies = getMoviesForList(listName);

      store.dispatch({
        ...movies,
        type: 'MOVIES_FOR_SELECTED_LIST',
      });
    }
  });

  document.querySelector('#resultContainer').addEventListener('click', (evt) => {
    if (evt.target.className.search('delete') >= 0) {
      evt.preventDefault();
      const movieEl = getParent(evt.target, 'mov-details');
      const listToBeRemoved = movieEl.querySelector('.in-lists .list-item').firstChild.textContent.trim();
      const movid = movieEl.dataset.id;
      store.dispatch({
        type: 'MOVIE_REMOVED_FROM_LIST',
        name: listToBeRemoved,
      });
      collectionService.removeMovieFromList(movid, listToBeRemoved);
      const movies = getUpdatedMovies();
      // console.log(movies);
      if (movies) {
        store.dispatch({
          type: 'UPDATED_MOVIES_FROM_LIST',
          ...movies,
        });
      }
    }
  });

  // Subscribe for movie search results
  store.subscribe(() => {
    // console.log('New State:', store.getState());
    const stor = { ...store.getState() };
    const resData = stor.searchResults;
    if (resData) {
      if (compareResults.has(resData)) {
        // console.log('returning as already exists');
        return;
      }
      const movieListContent = moviesList(resData);
      const resultContainer = document.querySelector('#resultContainer');
      compareResults.set(resData, movieListContent);
      resultContainer.innerHTML = '';
      resultContainer.appendChild(movieListContent);
      // const totalPages = stor.totalPages;
      if (stor.totalPages) {
        const pgeContainer = document.querySelector('#pagination');
        // const currPge = stor.currPge;
        pgeContainer.innerHTML = '';
        if (stor.totalPages > 10) {
          const min = (stor.currPge > 4) ? stor.currPge - 3 : 1;
          const max = min + 10;
          pgeContainer.appendChild(pagination({ totalPages: stor.totalPages, min, max }));
        } else {
          pgeContainer.appendChild(pagination({ totalPages: stor.totalPages, min: 0, max: 0 }));
        }
        pgeContainer.querySelector(`li.item-${stor.currPge}`).className += ' active';
      }
    }
  });

  // Subscribe for updating custom list values

  store.subscribe(() => {
    const list = store.getState().customList;
    if (compareList.has(list)) {
      // console.log('No change is custom list');
      return;
    }
    processListToStorage(list);
    const dataList = getCollectionsListHtml(list);
    const menuList = getCollectionMenu(list);
    compareList.set(list, dataList);
    const el = document.querySelector('#collections');
    el.innerHTML = dataList;
    const menuEl = document.querySelector('.collection-menu .collection-list');
    menuEl.innerHTML = menuList;
  });
};

module.exports = init;
