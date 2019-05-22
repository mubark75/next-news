import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Delete from "@material-ui/icons/Delete";
import { deleteUser } from "../../lib/api";
import { signoutUser } from "../../lib/auth";

class DeleteUser extends React.Component {
  state = {
    open: false,
    isDeleting: false
  };

  handleDeleteUser = async () => {
    const { user } = this.props;
    const { error } = await deleteUser(user._id);
    this.setState({ isDeleting: true });
    if (!error) {
      await signoutUser();
    } else {
      console.log(error);
      this.setState({ isDeleting: false });
    }
  };

  handleOpen = () => this.setState({ open: true });

  handleClose = () => this.setState({ open: false });

  render() {
    const {
      state: { open, isDeleting }
    } = this;
    return (
      <div style={{ marginTop: "40px" }}>
        <IconButton onClick={this.handleOpen} color="secondary">
          <Delete />
        </IconButton>

        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>Confirm to Delete Your Acount</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              cancel
            </Button>
            <Button
              onClick={this.handleDeleteUser}
              color="secondary"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting" : "confirm"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteUser;
