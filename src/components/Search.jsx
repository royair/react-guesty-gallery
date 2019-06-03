import React, { Component } from 'react';
import { inject, observer } from "mobx-react";

import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search'

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
  constructor(props) {
    super(props);

    this.state = { value: '' };
  }

  componentDidMount() {
    this.setState(() => ({ value: this.props.store.gallery.urlParams.q }));
  }

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  search = () => {
    const { value } = this.state;

    this.props.store.gallery.setQ(value);
  };

  handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.search();
    }
  };

  render() {
    return (
      <Paper style={useStyles.root}>
        <InputBase style={useStyles.input}
                   placeholder="Search giphy"
                   value={this.state.value}
                   onChange={this.handleChange}
                   onKeyPress={this.handleOnKeyPress}
        />
        <IconButton style={useStyles.iconButton}
                    aria-label="Search"
                    onClick={this.search}
        >
          <SearchIcon/>
        </IconButton>
      </Paper>
    )
  }
}

Search.defaultProps = {};

export default inject('store')(observer(Search));
