import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ClearIcon from "@material-ui/icons/Clear";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import SearchButton from "../../components/SearchButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { OutlinedInput } from "@material-ui/core";

const styles = theme => ({
  clearIcon: {
    cursor: "pointer"
  }
});

class SearchWithSelectionInput extends React.PureComponent {
  state = {
    selectionDone: false
  };
  componentDidMount() {
    const { model, onSearchDone, localObserver } = this.props;
    localObserver.publish("toolchanged");
    model.selectionSearch(() => {
      this.setState({ selectionDone: true });
    }, onSearchDone);
  }

  renderInput() {
    const { classes, resetToStartView } = this.props;
    if (this.state.polygonDrawn) {
      this.input.blur();
    }
    return (
      <div style={{ display: "flex", flex: "auto" }}>
        <OutlinedInput
          autoComplete="off"
          autoFocus
          readOnly
          inputRef={input => {
            this.input = input;
          }}
          value={
            this.state.selectionDone
              ? "Markerat område : 1"
              : "Markera objekt i kartan"
          }
          startAdornment={
            <InputAdornment position="start">
              <AddCircleOutline />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <ClearIcon
                className={classes.clearIcon}
                onClick={() => {
                  resetToStartView();
                }}
              />
            </InputAdornment>
          }
        />

        <SearchButton />
      </div>
    );
  }
  render() {
    return (
      <div style={{ display: "flex", flex: "auto" }}>
        {this.renderInput()}
        <SearchButton />
      </div>
    );
  }
}

SearchWithSelectionInput.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchWithSelectionInput);
