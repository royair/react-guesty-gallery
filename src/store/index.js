import { observable, decorate } from 'mobx';

import Gallery from './gallery';

class Store {
  gallery = new Gallery();
}

decorate(Store, { gallery: observable});

export default new Store();
