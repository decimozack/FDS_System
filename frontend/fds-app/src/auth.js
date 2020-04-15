import ManagerDataService from "./services/manager.service";

class auth {
  constructor() {
    this.authenticated = false;
  }

  login(cb, email, password) {
    this.authenticated = true;

    if (typeof email === "undefined" || typeof password === "undefined") {
      return;
    }

    ManagerDataService.verifyLogin(email, password)
      .then((response) => {
        if (response.data.rowCount === 1) {
          console.log(response.data);
          // console.log(response.data.rows[0].usertype);
          localStorage.setItem("user", JSON.stringify(response.data.rows[0]));
          cb(true);
        } else {
          cb(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  isAuthenticated() {
    let user = localStorage.getItem("user");
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}

export default new auth();
