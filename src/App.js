import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import qs from 'query-string';
import moment from 'moment';

import './App.scss';
import { runInAction } from "mobx";

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initSearchParams();
  }

  initSearchParams() {
    const oldSearchParams = this.props.store.gallery.searchParams;
    const newSearchParams = qs.parse(this.props.location.search);

    runInAction(() => {
      this.props.store.gallery.searchParams = { ...oldSearchParams, ...newSearchParams };
    });
  }

  formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  search = (e) => {
    const { value } = e.target;

    this.props.store.gallery.setQ(value);
  };

  handleChange = (e) => {
    this.props.store.gallery.sortString = e.target.value;
  };

  render() {
    let { photos } = this.props.store.gallery;

    let photosUi = photos.map((photo) =>
      <Grid key={photo.id} item>
        <Card style={{ width: '300px' }}>
          <CardContent>
            <Typography component="p">
              {photo.slug}
            </Typography>
          </CardContent>


          <CardMedia
            style={{ height: '300px' }}
            image={photo.images.downsized.url}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography component="p">
              {this.formatDate(photo.import_datetime)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );

    return (
      <div className="App">
        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} sm={10} md={8} lg={5} xl={3}>
            <TextField
              style={{ width: '100%' }}
              id="outlined-search"
              label="Search photos"
              type="search"
              className=""
              margin="normal"
              variant="outlined"
              value={this.props.store.gallery.searchParams.q}
              onChange={(e) => this.search(e)}
            />
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={3}>
          <Grid item xs={12} sm={10} md={8} lg={5} xl={3}>

            <FormControl variant="outlined">

              <InputLabel ref={this.sortType} htmlFor="outlined-age-simple">
                sort
              </InputLabel>

              <Select
                value={this.props.store.gallery.sortString}
                onChange={this.handleChange}
                input={<OutlinedInput labelWidth={1} name="age"
                                      id="outlined-age-simple"/>}
              >
                <MenuItem value={'Sort by Title ASC'}>Sort by Title
                  ASC</MenuItem>
                <MenuItem value={'Sort by Title DESC'}>Sort by Title
                  DESC</MenuItem>
                <MenuItem value={'Sort by Imported date ASC'}>Sort by Imported
                  date ASC</MenuItem>
                <MenuItem value={'Sort by Imported date DESC'}>Sort by Imported
                  date DESC</MenuItem>
              </Select>
            </FormControl>

          </Grid>
        </Grid>

        <Grid container justify="center" spacing={3}>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              displaying <span
              style={{ fontWeight: 600 }}>{photosUi.length}</span> images
            </Typography>
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={3}>
          {photosUi}
        </Grid>

        <Grid container justify="center" spacing={3}>
          <Grid item>

          </Grid>
        </Grid>
      </div>
    );
  }
}

export default inject('store')(observer(App));
