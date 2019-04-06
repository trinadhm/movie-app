import {
  compose, createHTMLElement, row, col, map, join, container,
} from '../utilities/functions';
import { posterBasePath } from '../services/config';

const generateListInCard = (list) => {
  if (!list) {
    return 'Add to a List';
  }
  return list.reduce((acc, item) => `
    ${acc}<span class='list-item badge badge-pill badge-info'>${item} <a href='#' class='delete close'>remove</a></span>
  `, '');
};

const cardHTML = ({
  title, releaseDate, voteAverage, popularity, overview, id, posterPath, inList,
}) => `
<div class="col col-md-7 col-sm-12 col-12 mov-details"
  data-movietitle=${encodeURI(title)} data-year=${releaseDate} data-vote=${voteAverage}
  data-popularity=${popularity} data-desc=${encodeURI(overview)} data-id=${id} data-poster=${posterPath}>
<h3 class="mov-title">${title}</h3>
<p class="year">
  ${releaseDate}
</p>
<p class='in-lists'>
<span class='label'> In Lists: </span>
<span class='list-items'> ${generateListInCard(inList)} </span>
</p>
<p class="ratings">
  <span class="r-name">Avg.Voted Rating: </span>
  <span class="r-value">${voteAverage}</span>
  <span class="r-name">Popularity Rating: </span>
  <span class="r-value">${popularity}</span>
</p>
<p class="desc">
  ${overview}
</p>
</div>
`;

const _imgHTML = posterBase => ({ posterPath, title }) => `
<div class="col poster col-12 col-md-3 col-sm-12">
  <img src="${posterBase}${posterPath}" alt="${title}">
</div>
`;
const imgHTML = _imgHTML(posterBasePath);


// const addListHtml = () => `
// <div class="col add-list col-md-2 col-sm-12">
//   <p> Add to List </p>
// </div>
// `;

const getCollectionsListHtml = (list) => {
  if (!list) {
    return '<option value="Favourites">Favourites</option>';
  }
  return list.reduce((accu, item) => `${accu}<option value=${item}>${item}</opiton>`, '');
};

const getCollectionMenu = (list) => {
  if (!list) {
    return '<a class="dropdown-item" href="#Favourites">Favourites</a>';
  }
  return list.reduce((accu, item) => `${accu}<a class="dropdown-item" href="#${item}">${item}</a>`, '');
};

const addListHtml = id => `
  <div class="col add-list col-md-2 col-sm-12 form">
   <div class='form-group'>
   <label for="addList${id}">Add to List</label>
   <input type="text" class="form-control add-to-list" id="addList${id}" placeholder="Add to List" value="" list="collections">
   <div class="alert alert-info"><span class="alert-danger">*</span> If entering a new/custom List item, hit enter to save </div>
   </div>
  </div>
  `;

const movieCardHtml = ({
  title, release_date: releaseDate,
  vote_average: voteAverage, popularity,
  overview, poster_path: posterPath,
  id, list: inList,
}) => `
${imgHTML({ posterPath, title })}
${cardHTML({
    title, releaseDate, voteAverage, popularity, overview, id, posterPath, inList,
  })}
${addListHtml(id)}
`;

const movieCard = compose(row, movieCardHtml);

const moviesList = compose(createHTMLElement, container, join(''), map(movieCard));

const _pagination = ({ totalPages, min, max }) => {
  // console.log(totalPages, min, max);
  const minPage = parseInt(min, 10) || 1;
  const maxPage = parseInt(max, 10);
  const temp = (minPage && maxPage)
    ? new Array(maxPage - minPage).fill(0, 0, maxPage - minPage)
    : new Array(totalPages).fill(0, 0, totalPages);
  return `${temp.reduce((acc, cv, ci) => `${acc}<li class='page-item item item-${ci + minPage}'>
  <a class='page-link' href='#${ci + minPage}'>${ci + minPage}</a></li>`,
  `<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">`)}</ul></nav>`;
};

const pagination = compose(createHTMLElement, container, row, col, _pagination);

export {
  moviesList,
  pagination,
  getCollectionsListHtml,
  getCollectionMenu,
  generateListInCard,
};
