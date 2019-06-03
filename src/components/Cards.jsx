import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import moment from "moment";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";

class Cards extends Component {
  formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  render() {
    let { photos } = this.props.store.gallery;
    let photosUi   = photos.map((photo) =>
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
      photosUi
    )
  }
}

Cards.defaultProps = {};

export default inject('store')(observer(Cards));
