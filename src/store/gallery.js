import {
  decorate,
  observable,
  computed,
  action,
  configure,
  runInAction,
  reaction,
} from "mobx";
import axios from 'axios'
import moment from 'moment';
import React from "react";
import qs from "query-string";
import { debounce } from 'lodash';

const DEFAULT_SORT_TYPE   = 'TITLE';
const DEFAULT_SORT_VALUE  = 'ASC';
const DEFAULT_SORT_STRING = 'Sort by Title ASC';

configure({ enforceActions: 'observed' });

class Gallery {
  constructor() {
    this._photos   = [];
    this.urlParams = {
      sortType: DEFAULT_SORT_TYPE,
      sortValue: DEFAULT_SORT_VALUE,
      q: '',
    };

    this._sortString = DEFAULT_SORT_STRING;

    // initiate search every time 'q' (query) has changed
    reaction(
      () => this.urlParams.q,
      debounce(this.search, 300));

    // update url params and website's history every time model has changed
    reaction(
      () => Object.values(this.urlParams),
      () => {
        window.history.pushState('', null, '#/?' + qs.stringify(this.urlParams));
      });

    // update
    reaction(
      () => ([this.urlParams.sortValue, this.urlParams.sortType]),
      () => {
        const by         = this.urlParams.sortType === 'DATETIME' ? 'Imported date' : 'Title';
        this._sortString = `Sort by ${by} ${this.urlParams.sortValue}`;
      });
  };

  setQ(str) {
    this.urlParams.q = str;
  }

  search = () => {
    if (!this.urlParams.q) {
      runInAction(() => {
        this.photos = [];
      });
    }

    axios
      .get(`https://api.giphy.com/v1/gifs/search?api_key=dCpV0z0dW988CrZDZ8DYJtLMrJJI0pSz&q=${this.urlParams.q}&limit=9`)
      .then((res) => {
        runInAction(() => {
          this.photos = res.data.data;
        });
      });
  };

  get sortString() {
    return this._sortString;
  };

  set sortString(str) {
    switch (str) {
      case 'Sort by Title ASC':
        this.urlParams.sortValue = 'ASC';
        this.urlParams.sortType  = 'TITLE';
        break;

      case 'Sort by Title DESC':
        this.urlParams.sortValue = 'DESC';
        this.urlParams.sortType  = 'TITLE';
        break;

      case 'Sort by Imported date ASC':
        this.urlParams.sortValue = 'ASC';
        this.urlParams.sortType  = 'DATETIME';
        break;

      case 'Sort by Imported date DESC':
        this.urlParams.sortValue = 'DESC';
        this.urlParams.sortType  = 'DATETIME';
        break;
    }

    this._sortString = str;
  };

  set photos(arr) {
    this._photos = arr;
  }

  get photos() {

    switch (this.urlParams.sortType) {
      case 'TITLE':
        return this.sortByTitle(this._photos);
        break;

      case 'DATETIME':
        return this.sortByDate(this._photos);
        break;

      default:
        return this._photos;
    }

  };

  sortByTitle(arr) {
    return arr.slice().sort(this.compareByTitle);
  };

  sortByDate(arr) {
    return arr.slice().sort(this.compareByDate);
  };

  compareByTitle = (a, b) => {

    if (a.title < b.title) {
      return this.urlParams.sortValue === 'ASC' ? -1 : 1;
    }

    if (a.title > b.title) {
      return this.urlParams.sortValue === 'ASC' ? 1 : -1;
    }

    return 0;
  };

  compareByDate = (a, b) => {
    if (moment(a.import_datetime).isBefore(b.import_datetime)) {
      return this.urlParams.sortValue === 'ASC' ? -1 : 1;
    }

    if (moment(b.import_datetime).isBefore(a.import_datetime)) {
      return this.urlParams.sortValue === 'ASC' ? 1 : -1;
    }

    return 0;
  }
}

decorate(Gallery, {
  _photos: observable,
  _sortString: observable,
  sortString: computed,
  photos: computed,
  urlParams: observable,
  setQ: action,
});

export default Gallery;
