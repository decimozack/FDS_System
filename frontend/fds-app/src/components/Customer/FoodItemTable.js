import React from "react";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";

const useStyles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  table: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  actions: {
    color: "blue",
  },
});

class FoodItemTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.table}>
          <MaterialTable
            title={
              this.props.restaurant !== null &&
              this.props.restaurant.rname + " Restaurant Listing"
            }
            columns={[
              {
                title: "Food Item Name",
                field: "fname",
                width: 100,
              },
              {
                title: "Category",
                field: "catname",
                width: 50,
              },
              {
                title: "Description",
                field: "description",
                width: 130,
              },
              {
                title: "Price",
                field: "price",
                type: "currency",
                width: 100,
                cellStyle: { textAlign: "left" },
              },
            ]}
            data={this.props.foodItems}
            actions={[
              {
                icon: "add_shopping_cart",
                tooltip: "Add To Cart",
                onClick: (event, rowData) => {
                  this.props.onClick(event, rowData);
                },
              },
            ]}
            options={{
              actionsColumnIndex: -1,
              headerStyle: {
                backgroundColor: "#01579b",
                color: "#FFF",
              },
            }}
            localization={{
              header: {
                actions: "Add to Cart",
              },
            }}
          />
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(FoodItemTable);
