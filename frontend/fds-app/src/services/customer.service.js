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

  getReviews() {
    return http.get(baseUrl + "/getReviews/");
  }

  getReview(id) {
    return http.get(baseUrl + "/getReview/" + id);
  }

  submitOrder(data) {
    const sendData = {
      userId: data.user.userid,
      restaurantId: data.restaurant.rid,
      min_order_cost: data.restaurant.min_order_cost,
      orderItems: data.orderItems,
      use_credit_card: data.use_credit_card,
      use_points: data.use_points,
      price: data.price,
      delivery_fee: data.delivery_fee,
      address: data.address,
      location_area: data.location_area,
      gain_reward_pts: data.gain_reward_pts,
    };
    return http.post(baseUrl + "/submitOrder/", sendData);
  }

  getOrders(cid) {
    const data = { cid: cid };
    return http.post(baseUrl + "/getOrders/", data);
  }

  submitReview(oid, rating, comments) {
    const data = { oid: oid, rating: rating, comments: comments };
    return http.post(baseUrl + "/submitReview/", data);
  }
}

export default new CustomerDataService();
