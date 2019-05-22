import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Edit from "@material-ui/icons/Edit";
import withStyles from "@material-ui/core/styles/withStyles";
import Link from "next/link";

import FollowUser from "../components/profile/FollowUser";
import DeleteUser from "../components/profile/DeleteUser";
import { authInitialProps } from "../lib/auth";
import { getUser } from "../lib/api";

class Profile extends React.Component {
  state = {
    user: null,
    isAuth: false,
    isFollowing: false,
    isloading: true
  };

  componentDidMount = async () => {
    const { userId, auth } = this.props;
    const isAuth = auth.user._id === userId;
    const user = await getUser(userId);
    const isFollowing =
      user.followers.findIndex(follower => follower._id === auth.user._id) > -1
        ? true
        : false;
    this.setState({ user, isAuth, isloading: false, isFollowing });
  };

  toggleFollow = async sendRequest => {
    const { userId } = this.props;
    const { isFollowing } = this.state;

    await sendRequest(userId);
    this.setState({ isFollowing: !isFollowing });
  };

  render() {
    const {
      props: { classes },
      state: { user, isAuth, isFollowing, isloading }
    } = this;
    return (
      <Paper className={classes.root}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          className={classes.title}
        >
          Profile
        </Typography>
        {isloading ? (
          <div className={classes.progressContainer}>
            <CircularProgress
              className={classes.progress}
              size={55}
              thickness={5}
            />
          </div>
        ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} className={classes.bigAvatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />
              {isAuth ? (
                <ListItemSecondaryAction>
                  <Link href="/edit-profile">
                    <a>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </a>
                  </Link>
                </ListItemSecondaryAction>
              ) : (
                <FollowUser
                  isFollowing={isFollowing}
                  toggleFollow={this.toggleFollow}
                />
              )}
              <DeleteUser user={user} />
            </ListItem>
            <Divider />
            <ListItem
              primary={user.about}
              secondary={`Joined: ${user.createdAt}`}
            />
          </List>
        )}
      </Paper>
    );
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: 600
    }
  },
  title: {
    color: theme.palette.primary.main
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
});

Profile.getInitialProps = authInitialProps(true);

export default withStyles(styles)(Profile);
