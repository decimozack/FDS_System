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

  updateCustomer(customerData) {
    return http.post(`/manager/updateCustomer/`, customerData);
  }
}

export default new ManagerDataService();
