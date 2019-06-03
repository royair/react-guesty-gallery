import React, { Component } from 'react';

import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import { inject, observer } from "mobx-react";
import { runInAction } from "mobx";

class Sort extends Component {
  getSelectValue = () => {
    const { sortType, sortValue } = this.props.store.gallery.urlParams;

    return `{"sortType": "${sortType}", "sortValue": "${sortValue}"}`;
  };

  handleChange = (e) => {
    const value        = e.target.value;
    const valueParsed  = JSON.parse(value);
    const oldUrlParams = this.props.store.gallery.urlParams;

    runInAction(() => {
      this.props.store.gallery.urlParams = { ...oldUrlParams, ...valueParsed };
    });
  };

  render() {
    return (
      <FormControl variant="outlined"
                   style={{ width: '100%' }}
                   margin="normal">
        <InputLabel ref={this.sortType}
                    htmlFor="outlined-sort-simple"
        >
          sort
        </InputLabel>

        <Select
          value={this.getSelectValue()}
          onChange={this.handleChange}
          input={<OutlinedInput labelWidth={30}
                                name="sort"
                                id="outlined-sort-simple"/>}
        >
          <MenuItem
            value={'{"sortType": "title", "sortValue": "asc"}'}>
            Sort by Title ASC
          </MenuItem>
          <MenuItem
            value={'{"sortType": "title", "sortValue": "desc"}'}>
            Sort by Title DESC
          </MenuItem>
          <MenuItem
            value={'{"sortType": "datetime", "sortValue": "asc"}'}>
            Sort by Imported date ASC
          </MenuItem>
          <MenuItem
            value={'{"sortType": "datetime", "sortValue": "desc"}'}>
            Sort by Imported date DESC
          </MenuItem>
        </Select>
      </FormControl>
    )
  }
}

Sort.defaultProps = {};

export default inject('store')(observer(Sort));
