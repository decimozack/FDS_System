import http from "../http-common";

class ManagerDataService {
  getAll() {
    return http.get("/manager/getCustomerList");
  }

  verifyLogin(email, password) {
    let data = {
      email: email,
      password: password,
    };

    return http.post(`/manager/verifyLogin/`, data);
  }

  customerSignUp(customerData) {
    console.log(customerData);
    return http.post(`/manager/customerSignup/`, customerData);
  }

  employeeSignUp(emprData) {
    console.log(emprData);
    return http.post(`/manager/EmpSignup/`, emprData);
  }

  retrieveCustomer(cid) {
    const data = {
      id: cid,
    };
    return http.post(`/manager/retrieveCustomer/`, data);
  }

  retrieveCustomer(cid, usertype) {
    const data = {
      id: cid,
    };
    return http.post(`/manager/retrieveCustomer/`, data);
  }

  retrieveEmployee(id, usertype) {
    if (usertype === "m") {
      return this.retrieveManager(id);
    } else if (usertype === "ri") {
      return this.retrieveRider(id);
    } else {
      return null;
    }
  }

  retrieveManager(id) {
    const data = {
      id: id,
    };
    return http.post(`/manager/retrieveManager/`, data);
  }

  retrieveRider(id) {
    const data = {
      id: id,
    };
    return http.post(`/manager/retrieveRider/`, data);
  }

  updateCustomer(customerData) {
    return http.post(`/manager/updateCustomer/`, customerData);
  }

  updateEmployee(empData) {
    if (empData.workRole === "Manager") {
      return this.updateManager(empData);
    } else {
      return this.updateRider(empData);
    }
  }

  updateManager(empData) {
    return http.post(`/manager/updateManager/`, empData);
  }

  updateRider(empData) {
    return http.post(`/manager/updateRider/`, empData);
  }
}

export default new ManagerDataService();
