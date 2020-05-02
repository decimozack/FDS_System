class ShoppingCart {
  retrieveOrderItems() {
    return JSON.parse(localStorage.getItem("orderItems"));
  }

  deleteOrderItems() {
    localStorage.removeItem("orderItems");
  }

  setOrderItems(orderItems) {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
  }

  updateOrderItems(orderItems) {
    localStorage.setItem("orderItems", JSON.stringify(orderItems));
  }

  addOrderItem(orderItem) {
    let orderItems = this.retrieveOrderItems();
    if (orderItems === null) {
      orderItems = [];
    }
    orderItems.push(orderItem);
    this.updateOrderItems(orderItems);
  }
}

export default new ShoppingCart();
