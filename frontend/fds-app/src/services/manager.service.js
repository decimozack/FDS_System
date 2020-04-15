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
}

export default new ManagerDataService();
