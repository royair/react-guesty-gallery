import { shuffle } from 'lodash';
import {
  decorate,
  observe,
  observable,
  computed,
  action,
  toJS,
  configure,
  runInAction,
  reaction,
  autorun
} from "mobx";
import axios from 'axios'
import moment from 'moment';
import React from "react";
import qs from "query-string";

const DEFAULT_SORT_TYPE   = 'TITLE';
const DEFAULT_SORT_VALUE  = 'ASC';
const DEFAULT_SORT_STRING = 'Sort by Title ASC';

configure({ enforceActions: 'observed' });

class Gallery {
  constructor(api) {
    this._photos      = [];
    this.searchParams = {
      sortType: DEFAULT_SORT_TYPE,
      sortValue: DEFAULT_SORT_VALUE,
      q: ''
    };

    this._sortString = DEFAULT_SORT_STRING;

    reaction(
      () => this.searchParams.q,
      this.search);

    reaction(
      () => Object.values(this.searchParams),
      () => {
        window.history.pushState('', null, '?' + qs.stringify(this.searchParams));
      });

    reaction(
      () => ([this.searchParams.sortValue, this.searchParams.sortType]),
      () => {
        const by         = this.searchParams.sortType === 'DATETIME' ? 'Imported date' : 'Title';
        this._sortString = `Sort by ${by} ${this.searchParams.sortValue}`;
      });
  };

  setQ(str) {
    this.searchParams.q = str;
  }

  search = () => {
    if (!this.searchParams.q) {
      runInAction(() => {
        this.photos = [];
      });
    }

    axios
      .get(`https://api.giphy.com/v1/gifs/search?api_key=dCpV0z0dW988CrZDZ8DYJtLMrJJI0pSz&q=${this.searchParams.q}&limit=9`)
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
        this.searchParams.sortValue = 'ASC';
        this.searchParams.sortType  = 'TITLE';
        break;

      case 'Sort by Title DESC':
        this.searchParams.sortValue = 'DESC';
        this.searchParams.sortType  = 'TITLE';
        break;

      case 'Sort by Imported date ASC':
        this.searchParams.sortValue = 'ASC';
        this.searchParams.sortType  = 'DATETIME';
        break;

      case 'Sort by Imported date DESC':
        this.searchParams.sortValue = 'DESC';
        this.searchParams.sortType  = 'DATETIME';
        break;
    }

    this._sortString = str;
  };

  set photos(arr) {
    this._photos = arr;
  }

  get photos() {

    switch (this.searchParams.sortType) {
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

    if (a.slug < b.slug) {
      return this.searchParams.sortValue === 'ASC' ? -1 : 1;
    }

    if (a.slug > b.slug) {
      return this.searchParams.sortValue === 'ASC' ? 1 : -1;
    }

    return 0;
  };

  compareByDate = (a, b) => {
    if (moment(a.import_datetime).isBefore(b.import_datetime)) {
      return this.searchParams.sortValue === 'ASC' ? -1 : 1;
    }

    if (moment(b.import_datetime).isBefore(a.import_datetime)) {
      return this.searchParams.sortValue === 'ASC' ? 1 : -1;
    }

    return 0;
  }
}

decorate(Gallery, {
  _photos: observable,
  _sortString: observable,
  sortString: computed,
  photos: computed,
  searchParams: observable,
  setQ: action,
});

export default Gallery;
