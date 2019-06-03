import React, { Component } from 'react';
import { inject, observer } from "mobx-react";

import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/core/SvgIcon/SvgIcon";

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

class Search extends Component {
  search = (e) => {
    const { value } = e.target;

    this.props.store.gallery.setQ(value);
  };

  render() {
    return (
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
    )
  }
}

Search.defaultProps = {};

export default inject('store')(observer(Search));
