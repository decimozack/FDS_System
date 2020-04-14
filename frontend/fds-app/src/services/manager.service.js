import http from "../http-common";

class ManagerDataService {
  getAll() {
    return http.get("/getUserList");
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
}

export default new ManagerDataService();
