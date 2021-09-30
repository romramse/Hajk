import React from "react";
import { Button, Paper, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(1),
  },
  button: {
    minWidth: "unset",
  },
}));

/**
 * @summary Hides all visible layers
 *
 * @param {object} props
 * @returns {object} React
 */
const ThemeToggler = React.memo((props) => {
  const classes = useStyles();

  return (
    (props.showThemeToggler && (
      <Tooltip title="Växla mellan mörkt och ljust färgtema">
        <Paper className={classes.paper}>
          <Button
            aria-label="Växla färgtema"
            className={classes.button}
            onClick={(e) => {
              props.toggleMUITheme();
            }}
          >
            <Brightness4Icon />
          </Button>
        </Paper>
      </Tooltip>
    )) ||
    null
  );
});

export default ThemeToggler;
