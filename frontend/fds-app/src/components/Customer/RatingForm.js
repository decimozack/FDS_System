import React from "react";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import auth from "../../auth";
import CustomerDataService from "../../services/customer.service";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import Alert from "@material-ui/lab/Alert";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import StarIcon from "@material-ui/icons/Star";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  actions: {
    color: "blue",
  },
});

class RatingForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: this.props.location.state,
      rating: 0,
      review: null,
      comments: "",
      errorMsg: "",
      successMsg: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveReview = this.retrieveReview.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.retrieveReview = this.retrieveReview.bind(this);
  }

  componentDidMount() {
    this.retrieveReview(this.state.order.oid);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log(value);
    this.setState({
      [name]: value,
    });
  }

  retrieveReview(oid) {
    CustomerDataService.getReview(oid)
      .then((response) => {
        this.setState({
          review: response.data.rows[0],
          comments: response.data.rows[0].description,
          rating: response.data.rows[0].rating,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  submitReview() {
    CustomerDataService.submitReview(
      this.state.order.oid,
      this.state.rating,
      this.state.comments
    )
      .then((response) => {
        this.props.history.push("/customer/", {
          successMsg: "you have submitted your review",
        });
      })
      .catch((e) => {
        if (e.response) {
          this.setState({ errorMsg: e.response.data });
        }
      });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({ errorMsg: "" });
    this.submitReview();
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <StarIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Order Review
          </Typography>

          {this.state.review !== null && (
            <Typography component="h4" variant="h6">
              {this.state.review.rname}
            </Typography>
          )}

          {this.state.errorMsg.length > 0 && (
            <Alert severity="error">{this.state.errorMsg}</Alert>
          )}
          {this.state.successMsg.length > 0 && (
            <Alert severity="success">{this.state.successMsg}</Alert>
          )}
          <form
            className={classes.form}
            onSubmit={this.handleSubmit}
            noValidate
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="comments"
              label="Restaurant Review"
              name="comments"
              value={this.state.comments}
              onChange={this.handleChange}
              autoFocus
              multiline
              rows={10}
            />
            <Box component="fieldset" mb={3} borderColor="transparent">
              <Typography component="legend">Rider Rating</Typography>
              <Rating
                name="rating"
                value={this.state.rating}
                onChange={this.handleChange}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit Review
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(RatingForm);
