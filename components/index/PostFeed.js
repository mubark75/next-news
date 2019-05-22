import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import NewPost from "./NewPost";
import Post from "./Post";

import { getPostFeed, addPost, deletePost } from "../../lib/api";

class PostFeed extends React.Component {
  state = {
    posts: [],
    text: "",
    image: "",
    isAddingPost: false,
    isDeletingPost: false
  };

  componentDidMount = async () => {
    this.postData = new FormData();
    const { auth } = this.props;

    const { error, data } = await getPostFeed(auth.user._id);
    if (!error) {
      this.setState({ posts: data });
    } else {
      console.log(data);
    }
  };

  handleChange = e => {
    let inputValue;
    if (e.target.name === "image") {
      inputValue = e.target.files[0];
    } else {
      inputValue = e.target.value;
    }
    this.postData.set(e.target.name, inputValue);
    this.setState({ [e.target.name]: inputValue });
  };

  handleAddPost = async () => {
    const { auth } = this.props;
    this.setState({ isAddingPost: true });
    const { error, data } = await addPost(auth.user._id, this.postData);
    if (!error) {
      this.setState({
        posts: [data, ...this.state.posts],
        isAddingPost: false,
        text: "",
        image: ""
      });
      this.postData.delete("image");
    } else {
      console.log(error);
      this.setState({ isAddingPost: false });
    }
  };

  handleDeletePost = async deletedPost => {
    this.setState({ isDeletingPost: true });
    const { error, data } = await deletePost(deletedPost._id);
    if (!error) {
      const updatedPosts = this.state.posts.filter(
        post => post._id !== deletedPost._id
      );
      this.setState({ posts: updatedPosts, isDeletingPost: false });
    } else {
      console.log(data);
    }
  };

  render() {
    const {
      props: { auth, classes },
      state: { posts, text, image, isAddingPost, isDeletingPost }
    } = this;
    return (
      <div className={classes.root}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          color="primary"
          className={classes.title}
        >
          Post Feed
        </Typography>
        <NewPost
          auth={auth}
          text={text}
          image={image}
          handleChange={this.handleChange}
          isAddingPost={isAddingPost}
          handleAddPost={this.handleAddPost}
        />

        {posts.map(post => (
          <Post
            ket={post._id}
            auth={auth}
            post={post}
            isDeletingPost={isDeletingPost}
            handleDeletePost={this.handleDeletePost}
          />
        ))}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(PostFeed);
