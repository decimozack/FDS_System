class PointUsage {
  convertPointToMoney(point) {
    const convertRate = 0.05; // 1
    return convertRate * point;
  }

  convertMoneyToPoint(money) {
    const convertRate = 5;

    return Math.floor(convertRate * money);
  }
}
export default new PointUsage();
