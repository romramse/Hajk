import React, { Component } from "react";
import withStyles from "@mui/styles/withStyles";
import Page from "./Page.js";
import Typography from "@mui/material/Typography";

const styles = (theme) => {
  return {
    saveError: {
      color: theme.palette.error.contrastText,
      background: theme.palette.error.main,
      marginTop: "15px",
      borderRadius: theme.shape.borderRadius,
      padding: "5px",
    },
    errorText: {
      color: theme.palette.error.contrastText,
    },
  };
};

const saveErrorText = "Fel - din kommentar gick inte att spara.";
//const validationErrorText = " - detta fält krävs";
class CollectorForm extends Component {
  state = {
    comment: "",
    saveError: "",
    validationError: "",
    form: [],
    displayPlace: false,
    activePage: 0,
    direction: "right",
  };

  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      form: props.form,
    };

    props.model.observer.subscribe("abort", () => {
      this.abort();
    });

    props.model.observer.subscribe("reset", () => {
      // Set the page indicator to -1. This will reset the form properly.
      // Then set the page indicator to 0 to display the first page.
      // Just setting the flag to 0 will not reset the form if there is only one page.
      this.setState(
        {
          activePage: -1,
        },
        () => {
          this.setState({
            activePage: 0,
          });
        }
      );
    });
  }

  componentDidMount() {
    if (!this.props.model.serviceConfig) {
      this.setState({
        configurationError: true,
      });
    }
  }

  saveError = (text) => {
    this.setState({
      saveError: text || saveErrorText,
    });
  };

  renderSaveError() {
    const { classes } = this.props;
    return this.state.saveError ? (
      <div className={classes.saveError}>{this.state.saveError}</div>
    ) : null;
  }

  abort = () => {
    this.props.onClose();
  };

  render() {
    const { activePage, direction } = this.state;
    const { form, serviceConfig, classes } = this.props;
    if (this.state.configurationError) {
      return (
        <Typography className={classes.errorText}>
          Nödvändig konfiguration saknas. Verktyget kan inte användas för
          tillfället.
        </Typography>
      );
    } else {
      return form
        .sort((p1, p2) =>
          p1.order === p2.order ? 0 : p1.order > p2.order ? 1 : -1
        )
        .map(
          (page, i) =>
            activePage === page.order && (
              <Page
                key={i}
                serviceConfig={serviceConfig}
                model={this.props.model}
                active={activePage === page.order}
                numPages={form.length}
                page={page}
                direction={direction}
                options={this.props.options}
                onNextPage={() => {
                  this.setState({
                    activePage: activePage + 1,
                    direction: "left",
                  });
                }}
                onPrevPage={() => {
                  this.setState({
                    activePage: activePage - 1,
                    direction: "right",
                  });
                }}
              ></Page>
            )
        );
    }
  }
}

export default withStyles(styles)(CollectorForm);
