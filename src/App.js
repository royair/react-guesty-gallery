import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { runInAction } from "mobx";
import qs from 'query-string';

import Counter from './components/Counter';
import Cards from './components/Cards';
import Search from './components/Search';
import Sort from './components/Sort';

import Grid from '@material-ui/core/Grid';

import './App.scss';

class App extends Component {
  componentDidMount() {
    this.initUrlParams();
  }

  initUrlParams() {
    const oldUrlParams = this.props.store.gallery.urlParams;
    const newUrlParams = qs.parse(this.props.location.search);

    runInAction(() => {
      this.props.store.gallery.urlParams = { ...oldUrlParams, ...newUrlParams };
    });
  }

  render() {
    return (
      <div className="App">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={3} alignItems="center">
              <Search/>
              <Grid item xs={2}>
                <Sort/>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={3}>
          <Grid item>
            <Counter/>
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={3}>
          <Cards/>
        </Grid>
      </div>
    );
  }
}

export default inject('store')(observer(App));
