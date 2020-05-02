import React from "react";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import auth from "../../auth";
import CustomerDataService from "../../services/customer.service";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";

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

class OrdersTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      user: auth.getUser(),
    };
  }

  componentDidMount() {
    CustomerDataService.getOrders(this.state.user.userid)
      .then((response) => {
        this.setState({ orders: response.data.rows });
        console.log(this.state.orders);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.table}>
          <MaterialTable
            title={"Past Orders"}
            columns={[
              {
                title: "Order ID",
                field: "oid",
                type: "numeric",
              },
              {
                title: "Order Time",
                field: "order_time",
                type: "datetime",
              },
              {
                title: "Order Status",
                field: "order_status",
              },
              {
                title: "Price",
                field: "price",
                type: "currency",
                cellStyle: { textAlign: "left" },
              },
              {
                title: "Delivery Fee",
                field: "delivery_fee",
                type: "currency",
                cellStyle: { textAlign: "left" },
              },
              {
                title: "Address",
                field: "address",
              },
              {
                title: "Reward Points Gained",
                field: "gain_reward_pts",
                type: "numeric",
              },
              {
                title: "Credit Card?",
                field: "use_credit_card",
                lookup: {
                  true: <CheckCircleOutlineIcon />,
                  false: <CancelIcon />,
                },
              },
              {
                title: "Use Points?",
                field: "use_points",
                lookup: {
                  true: <CheckCircleOutlineIcon />,
                  false: <CancelIcon />,
                },
              },
            ]}
            data={this.state.orders}
            actions={[
              {
                icon: "rate_review",
                tooltip: "Give Review",
                onClick: (event, rowData) => {
                  alert("clicked");
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
                actions: "Actions",
              },
            }}
          />
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(OrdersTable);
