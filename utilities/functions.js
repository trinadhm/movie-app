const { createStore } = require('redux');
const searchApp = require('../model');
const store = createStore(searchApp);

const parent = (el, clsName) => {
  if(el.className.search(clsName) >= 0) {
    return el;
  } else {
    return parent(el.parentNode, clsName)
  }
}

module.exports = {
  makeAjax: function(url, method, data) {
    return new Promise( (resolve, reject) => {
      // Make Call
      // on success resolve
      // on Err reject
      const xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;
      try{
        xhr.addEventListener("readystatechange", () => {
          if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            resolve(xhr.responseText);
          }

          if(xhr.readyState === xhr.DONE && xhr.status !== 200) {
            reject(xhr);
          }
          
        });
        xhr.open(method, url);
        xhr.send(JSON.stringify(data));
      } catch(err) {
        reject(err);
      };
    });
  },
  store,
  compose: (...fns) => {
    return fns.reduceRight( (prevFn, nextFn) =>
      (...args) => {
        return nextFn(prevFn(...args))
      },
      value => value
    )
  },

  getStoredData: key => {
    const storedData = localStorage.getItem(key);
    if(storedData) {
      return JSON.parse(storedData);
    } else {
      return {};
    }
  },

  createHTMLElement: function(htmlString) {
    // console.log(htmlString);
    const el = document.createElement('div');
    el.innerHTML = htmlString;
    return el.firstElementChild;
  },

  row: (html) => `<div class='row'>${html}</div>`,
  col: (html, col) => `<div class='col ${col}'>${html}</div>`,
  container: html => `<div class='container'>${html}</div>`,
  map: fn => arr => {
    return arr.map( val => fn({...val}))
  },

  join: val => arr => {
    // console.log(val);
    return arr.join(val);
  },

  getParent: parent
}