import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import { Card, CardContent, Grid, Typography, Avatar } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PeopleIcon from "@material-ui/icons/PeopleOutlined";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt";
import TimerIcon from "@material-ui/icons/Timer";

const styles = (theme) => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontWeight: 700,
  },
  pos: {
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56,
  },
  icon: {
    height: 32,
    width: 32,
  },
});

const components = {
  people: PeopleIcon,
  order: AddShoppingCart,
  cost: MonetizationOn,
  time: TimerIcon,
  rating: SentimentSatisfiedAltIcon,
};
class DashboardCard extends React.Component {
  render() {
    const { classes } = this.props;
    const propValue = this.props.valueDisplay;
    const SpecificIcon = components[this.props.iconType];

    const bull = <span className={classes.bullet}>•</span>;
    return (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Grid container justify="space-between">
            <Grid item>
              <Typography
                className={classes.title}
                color="textSecondary"
                gutterBottom
              >
                {this.props.valueTitle}
              </Typography>

              {propValue.map((section) => (
                <div>
                  <Typography variant="h5" component="h2">
                    {section.label}
                  </Typography>
                  <Typography variant="h6" component="p">
                    <span style={{ color: "green" }}>+</span> {section.value}
                  </Typography>
                </div>
              ))}
            </Grid>
            <Grid item>
              <Avatar className={classes.avatar}>
                <SpecificIcon className={classes.icon} />
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(DashboardCard);
