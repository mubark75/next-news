import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";

import withStyles from "@material-ui/core/styles/withStyles";

import { signout } from "../lib/auth";

import ActiveLink from "./ActiveLink";

const Navbar = ({ classes, isAuthenticatd }) => {
  return (
    <AppBar position="static" className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
          className={classes.toolbarTitle}
        >
          <ActiveLink href="/">Next News</ActiveLink>
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        {isAuthenticatd ? (
          <>
            <Button size="small">
              <ActiveLink href="/profile">Profile</ActiveLink>
            </Button>{" "}
            <Button variant="outlined" size="small" onClick={signout}>
              Sign out
            </Button>
          </>
        ) : (
          <Button variant="outlined" size="small">
            <ActiveLink variant="outlined" href="/signin">
              Sign in
            </ActiveLink>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

const styles = theme => ({
  appbar: {
    color: "#777",
    backgroundColor: "#fafafa",
    boxShadow: "none"
  },
  toolbar: {
    borderBottom: `1px solid #eee`
  },
  toolbarTitle: {
    flex: 1
  }
});

export default withStyles(styles)(Navbar);
