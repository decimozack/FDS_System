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
        if (response.data.rowCount == 1) {
          console.log(response.data);
          localStorage.setItem("user", response.data.rows[0]);
          cb();
        } else {
          return false;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  logout(cb) {
    localStorage.removeItem("user");
    cb();
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
