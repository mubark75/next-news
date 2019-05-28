import Toolbar from "@material-ui/core/Toolbar";
import Link from "next/link";
import withStyles from "@material-ui/core/styles/withStyles";

const Categories = ({ classes }) => {
  const sections = [
    "Technology",
    "Design",
    "Culture",
    "Business",
    "Politics",
    "Opinion",
    "Science",
    "Health",
    "Style",
    "Travel"
  ];

  return (
    <Toolbar
      component="nav"
      variant="dense"
      className={classes.toolbarSecondary}
    >
      {sections.map(section => (
        <Link color="inherit" noWrap key={section} variant="body2" href="#">
          <a style={{ marginRight: "10px" }}>{section}</a>
        </Link>
      ))}
    </Toolbar>
  );
};

const styles = theme => ({
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto"
  },
  toolbarLink: {
    padding: "10px",
    flexShrink: 0
  }
});

export default withStyles(styles)(Categories);
