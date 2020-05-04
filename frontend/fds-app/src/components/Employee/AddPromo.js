import React from "react";
import Alert from "@material-ui/lab/Alert";
import MaterialTable from "material-table";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import ManagerDataService from "../../services/manager.service";
import auth from "../../auth";

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
  spacing: {
    marginTop: theme.spacing(3),
  },
});

class ViewPromos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: new Date(),
      endTime: new Date(),
      minSpend: 0,
      maxSpend: 0,
      discount: 0,
    };
  }

  componentDidMount() {}

  retrieveFDSPromos() {
    ManagerDataService.retrieveFDSPromos()
      .then((response) => {
        console.log(response.data);
        this.setState({ promoList: response.data.rows });
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
            title="FDS Discount Promo Listing"
            columns={[
              { title: "Promo ID", field: "pcid" },
              { title: "Start Time", field: "start_time", type: "datetime" },
              { title: "End Time", field: "end_time", type: "datetime" },
              { title: "Min Spend", field: "min_spend", type: "currency" },
              { title: "Max Spend", field: "max_spend", type: "currency" },
              { title: "Discount in %", field: "discount_m", type: "numeric" },
            ]}
            data={this.state.promoList.map((promo) => {
              return {
                discount_m: promo.discount + "%",
                ...promo,
              };
            })}
            actions={[
              {
                icon: "arrow_forward_ios",
                tooltip: "Update Promo",
                onClick: (event, rowData) => {
                  this.props.history.push("/manager/promo/" + rowData.pcid);
                },
              },
            ]}
            options={{ actionsColumnIndex: -1 }}
            localization={{
              header: {
                actions: "",
              },
            }}
          />
        </div>
      </Container>
    );
  }
}

export default withStyles(useStyles)(ViewPromos);
