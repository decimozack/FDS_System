import http from "../http-common";

class ManagerDataService {
  getAll() {
    return http.get("/getCustomerList");
  }

  verifyLogin(email, password) {
    let data = {
      email: email,
      password: password,
    };

    return http.post(`/verifyLogin/`, data);
  }

  customerSignUp(customerData) {
    console.log(customerData);
    return http.post(`/customerSignup/`, customerData);
  }

  employeeSignUp(emprData) {
    console.log(emprData);
    return http.post(`/EmpSignup/`, emprData);
  }

  retrieveCustomer(cid) {
    const data = {
      id: cid,
    };
    return http.post(`/retrieveCustomer/`, data);
  }

  updateCustomer(customerData) {
    return http.post(`/updateCustomer/`, customerData);
  }
}

export default new ManagerDataService();
