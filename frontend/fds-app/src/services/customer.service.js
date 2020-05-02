import http from "../http-common";

const baseUrl = "customer";
class CustomerDataService {
  getAll() {
    return http.get(baseUrl + "/getCustomerList");
  }

  getRestaurants() {
    return http.get(baseUrl + "/getRestaurantList");
  }
  getRestaurant(id) {
    return http.get(baseUrl + "/getRestaurant/" + id);
  }
  getFoodItems(id) {
    return http.get(baseUrl + "/getFoodItems/" + id);
  }
  submitOrder(data) {
    return http.post(baseUrl + "/getFoodItems/");
  }

  getOrders(cid) {
    const data = { cid: cid};
    return http.post(baseUrl + "/getOrders/",data);
  }
}

export default new CustomerDataService();
