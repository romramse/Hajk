import React, { useEffect, useRef, useState } from "react";
import { easeOut } from "ol/easing";
import { Button, Paper, Tooltip } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(1),
  },
  button: {
    minWidth: "unset",
  },
}));

const RotateControl = React.memo((props) => {
  const classes = useStyles();
  const view = useRef();
  const [rotation, setRotation] = useState(view.current?.getRotation() || 0);

  useEffect(() => {
    // No reason to go on if there's no map yet
    if (!props.map) return;

    // Put the View object into our ref
    view.current = props.map.getView();

    // Subscribe to View's rotation change event. When this happens,
    // we want to read the new rotation and put in state.
    view.current.on("change:rotation", subscribeToRotation);
    return () => {
      // Callback in useEffect is the place where we can cleanup
      // previous code. In this case, we unsubscribe the from the
      // event (so we don't get multiple listeners should this get
      // called more times).
      view.current.un("change:rotation", subscribeToRotation);
    };
  }, [props]);

  // Use when (un)subscribing View's change rotation event
  function subscribeToRotation() {
    setRotation(view.current.getRotation());
  }

  // onClick handler that resets the map (north at top)
  function rotateNorth() {
    // TODO: This could be an option in admin
    const duration = 400;

    if (!view.current) return;

    if (rotation !== undefined) {
      // If 'duration' will be an option, we must see if user wants to animate or not
      if (duration > 0) {
        view.current.animate({
          rotation: 0,
          duration: duration,
          easing: easeOut,
        });
      } else {
        view.current.setRotation(0);
      }
    }
  }

  return (
    (props.map && rotation !== 0 && (
      <Tooltip title="Återställ rotation">
        <Paper className={classes.paper}>
          <Button
            aria-label="Återställ rotation"
            className={classes.button}
            onClick={rotateNorth}
          >
            <NavigationIcon style={{ transform: `rotate(${rotation}rad)` }} />
          </Button>
        </Paper>
      </Tooltip>
    )) ||
    null
  );
});

export default RotateControl;
