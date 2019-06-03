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
import qs from "query-string";

const DEFAULT_SORT_TYPE  = 'title';
const DEFAULT_SORT_VALUE = 'asc';

configure({ enforceActions: 'observed' });

class Gallery {
  constructor() {
    this._photos   = [];
    this.urlParams = {
      sortType: DEFAULT_SORT_TYPE,
      sortValue: DEFAULT_SORT_VALUE,
      q: '',
    };

    // initiate search every time 'q' (query) has changed
    reaction(
      () => this.urlParams.q, this.search);

    // update url params and website's history every time model has changed
    reaction(
      () => Object.values(this.urlParams),
      () => {
        window.history.pushState('', null, '#/?' + qs.stringify(this.urlParams));
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

  set photos(arr) {
    this._photos = arr;
  }

  get photos() {
    switch (this.urlParams.sortType) {
      case 'title':
        return this.sortByTitle(this._photos);

      case 'datetime':
        return this.sortByDate(this._photos);

      default:
        return this._photos;
    }
  };

  get count() {
    return this._photos.length;
  }

  sortByTitle(arr) {
    const { sortValue } = this.urlParams;

    return arr.slice().sort(this.compareByTitle(sortValue));
  };

  compareByTitle = (sortValue) => {
    return (a, b) => {
      if (a.title < b.title) {
        return sortValue === 'asc' ? -1 : 1;
      }

      if (a.title > b.title) {
        return sortValue === 'asc' ? 1 : -1;
      }

      return 0;
    }
  };

  sortByDate(arr) {
    const { sortValue } = this.urlParams;

    return arr.slice().sort(this.compareByDate(sortValue));
  };

  compareByDate = (sortValue) => {
    return (a, b) => {
      if (moment(a.import_datetime).isBefore(b.import_datetime)) {
        return sortValue === 'asc' ? -1 : 1;
      }

      if (moment(b.import_datetime).isBefore(a.import_datetime)) {
        return sortValue === 'asc' ? 1 : -1;
      }

      return 0;
    }
  }
}

decorate(Gallery, {
  _photos: observable,
  photos: computed,
  urlParams: observable,
  setQ: action,
  count: computed
});

export default Gallery;
