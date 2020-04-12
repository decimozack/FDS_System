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
}

export default new ManagerDataService();
