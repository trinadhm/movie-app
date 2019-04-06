const { createStore } = require('redux');
const searchApp = require('../model');

const store = createStore(searchApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

module.exports = store;
