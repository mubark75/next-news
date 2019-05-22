import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUpload from "@material-ui/icons/CloudUpload";
import FaceTwoTone from "@material-ui/icons/FaceTwoTone";
import EditSharp from "@material-ui/icons/EditSharp";
import withStyles from "@material-ui/core/styles/withStyles";
import Router from "next/router";

import { authInitialProps } from "../lib/auth";
import { getAuthUser, updateUser } from "../lib/api";

class EditProfile extends React.Component {
  state = {
    name: "",
    email: "",
    about: "",
    avatar: "",
    avatarPreview: "",
    error: "",
    updatedUser: "",
    openError: false,
    openSuccess: false,
    isSaving: false,
    isLoading: false
  };

  componentDidMount = async () => {
    const { auth } = this.props;
    this.userData = new FormData();
    const { error, data } = await getAuthUser(auth.user._id);
    if (!error) {
      this.setState({ ...data, isLoading: false });
    } else {
      console.log(error);
      this.setState({ isLoading: false });
    }
  };

  handleChange = e => {
    let inputValue;
    if (e.target.name === "avatar") {
      inputValue = e.target.files[0];
      this.setState({ avatarPreview: this.createPreviewImage(inputValue) });
    } else {
      inputValue = e.target.value;
    }
    this.userData.set(e.target.name, inputValue);
    this.setState({ [e.target.name]: inputValue });
  };

  createPreviewImage = file => URL.createObjectURL(file);

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ isSaving: true, error: "" });
    const { error, data } = await updateUser(this.state._id, this.userData);
    if (!error) {
      this.setState({ isSaving: false, openSuccess: true, updateUser: data });
      setTimeout(() => Router.push(`/profile/${this.state._id}`), 6000);
    } else {
      this.setState({ openError: true, error: data });
    }
  };

  handleClose = () => this.setState({ openError: false });

  render() {
    const {
      props: { classes },
      state: {
        name,
        email,
        about,
        avatar,
        avatarPreview,
        isLoading,
        error,
        openError,
        openSuccess,
        updatedUser,
        isSaving
      }
    } = this;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp />
          </Avatar>
          <Typography variant="h5" component="h1">
            Edit Profile
          </Typography>
          <form onSubmit={this.handleSubmit} className={classes.form}>
            {isLoading ? (
              <Avatar className={classes.bigAvatar}>
                <FaceTwoTone />
              </Avatar>
            ) : (
              <Avatar
                src={avatarPreview || avatar}
                className={classes.bigAvatar}
              />
            )}
            <input
              type="file"
              name="avatar"
              id="avatar"
              onChange={this.handleChange}
              className={classes.input}
            />
            <label htmlFor="avatar" className={classes.uploadButton}>
              <Button variant="contained" color="secondary" component="span">
                Upload Image <CloudUpload />
              </Button>
            </label>
            <span className={classes.filenem}>{avatar && avatar.name}</span>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="about">About</InputLabel>
              <Input
                type="text"
                name="about"
                value={about}
                onChange={this.handleChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">email</InputLabel>
              <Input
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
            </FormControl>
            <Button
              type="sumit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Save
            </Button>
          </form>
          {/* Error snackbar */}
          {error && (
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              open={openError}
              onClose={this.handleClose}
              autoHideDuration={6000}
              message={<span className={classes.snack}>{error}</span>}
            />
          )}
        </Paper>
        {/* Success dialog */}
        <Dialog open={openSuccess} disableBackdropClick={true}>
          <DialogTitle>
            <VerifiedUserTwoTone className={classes.icon} />
            Next Account
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              User {updatedUser && updateUser.name} was successfully updated!
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto"
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0.25em"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  signinLink: {
    textDecoration: "none",
    color: "white"
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.secondary.light
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  },
  input: {
    display: "none"
  }
});

EditProfile.getInitialProps = authInitialProps(true);

export default withStyles(styles)(EditProfile);
