import React, { Component } from 'react';

import Typography from "@material-ui/core/Typography";
import { inject, observer } from "mobx-react";

class Counter extends Component {
  render() {
    const { count } = this.props.store.gallery;

    return (
      <Typography variant="h6" gutterBottom>
        displaying
        <span style={{ fontWeight: 600 }}> {count} </span>
        images
      </Typography>
    )
  }
}

Counter.defaultProps = {};

export default inject('store')(observer(Counter));
