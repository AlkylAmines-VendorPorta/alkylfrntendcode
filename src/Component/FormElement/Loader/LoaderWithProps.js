import React from "react";
import { Backdrop, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: theme.spacing(2),
  },
}));

const LoaderWithProps = ({ isLoading }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <CircularProgress style={{ color: "#3f51b5" }} size={80} thickness={4} />
      <Typography variant="h6" className={classes.text}>
        Loading...
      </Typography>
    </Backdrop>
  );
};

export default LoaderWithProps;
