import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Edit from "@material-ui/icons/Edit";
import SearchButton from "../../components/SearchButton";
import ClearIcon from "@material-ui/icons/Clear";
import InputAdornment from "@material-ui/core/InputAdornment";
import { OutlinedInput } from "@material-ui/core";

const styles = theme => ({
  clearIcon: {
    cursor: "pointer"
  }
});

class SearchWithPolygonInput extends React.PureComponent {
  state = {
    polygonDrawn: false
  };
  componentDidMount() {
    const { model, onSearchDone, localObserver } = this.props;
    localObserver.publish("toolchanged");
    model.polygonSearch(
      () => {
        this.setState({ polygonDrawn: true });
      },
      featureCollections => {
        onSearchDone(featureCollections);
      }
    );
  }

  renderInput() {
    const { classes, resetToStartView } = this.props;

    if (this.state.polygonDrawn) {
      this.input.blur();
    }

    return (
      <OutlinedInput
        autoComplete="off"
        autoFocus
        readOnly
        value={
          this.state.polygonDrawn
            ? "Markerat område : 1"
            : "Markera objekt i kartan"
        }
        inputRef={input => {
          this.input = input;
        }}
        startAdornment={
          <InputAdornment position="start">
            <Edit />
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

SearchWithPolygonInput.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchWithPolygonInput);
