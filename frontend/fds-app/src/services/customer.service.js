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
  submitOrder(user, restaurant, orderItems) {
    return http.get(baseUrl + "/getFoodItems/");
  }
}

export default new CustomerDataService();
