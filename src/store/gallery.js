import { shuffle } from 'lodash';
import {
  decorate,
  observable,
  computed,
  action,
  toJS,
  configure,
  runInAction
} from "mobx";
import axios from 'axios'
import { sortBy, cloneDeep } from 'lodash';
import moment from 'moment';
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import qs from 'query-string';
import React from "react";

const DEFAULT_SORT_TYPE   = 'TITLE';
const DEFAULT_SORT_VALUE  = 'ASC';
const DEFAULT_SORT_STRING = 'Sort by Title, ASC';

configure({ enforceActions: 'observed' });

class Gallery {
  constructor() {
    this._photos      = [];
    this.searchParams = {
      sortType: DEFAULT_SORT_TYPE,
      sortValue: DEFAULT_SORT_VALUE,
      q: ''
    };
    this.q            = '';
    this._sortString  = DEFAULT_SORT_STRING;
  }

  setq(str) {
    this.q = str;
  }

  search(str) {
    axios
      .get(`http://api.giphy.com/v1/gifs/search?api_key=dCpV0z0dW988CrZDZ8DYJtLMrJJI0pSz&q=${str}&limit=9`)
      .then((res) => {
        runInAction(() => {this.photos = res.data.data});
      });
  }

  get sortString() {
    return this._sortString;
  };

  set sortString(str) {
    switch (str) {
      case 'Sort by Title, ASC':
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
  q: observable,
  search: action,
  setq: action
});

export default Gallery;
