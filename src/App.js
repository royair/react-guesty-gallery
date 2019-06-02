import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

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
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import qs from 'query-string';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

import './App.scss';
import { runInAction } from "mobx";

const useStyles = {
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};

class App extends Component {
  constructor(props) {
    super(props);
  }

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
              {photo.title}
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


        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={3} alignItems="center">

              <Paper style={useStyles.root}>
                <InputBase style={useStyles.input}
                           placeholder="Search giphy"
                           value={this.props.store.gallery.urlParams.q}
                           onChange={(e) => this.search(e)}
                />
                <IconButton style={useStyles.iconButton} aria-label="Search">
                  <SearchIcon/>
                </IconButton>
              </Paper>

              <Grid item xs={2}>
                <FormControl variant="outlined"
                             style={{ width: '100%' }}
                             margin="normal">
                  <InputLabel ref={this.sortType}
                              htmlFor="outlined-sort-simple"
                  >
                    sort
                  </InputLabel>

                  <Select
                    value={this.props.store.gallery.sortString}
                    onChange={this.handleChange}
                    input={<OutlinedInput labelWidth={30}
                                          name="sort"
                                          id="outlined-sort-simple"/>}
                  >
                    <MenuItem value={'Sort by Title ASC'}>Sort by Title
                      ASC</MenuItem>
                    <MenuItem value={'Sort by Title DESC'}>Sort by Title
                      DESC</MenuItem>
                    <MenuItem value={'Sort by Imported date ASC'}>Sort by
                      Imported
                      date ASC</MenuItem>
                    <MenuItem value={'Sort by Imported date DESC'}>Sort by
                      Imported
                      date DESC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
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
