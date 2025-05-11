import axiosClient from "./axiosClient";
const OrderApi = {
  async add(data) {
    const url = "/orders/create";
    return axiosClient.post(url, data);
  },
  async getOrderByUserId(id) {
    const url = `/orders/user-by-id/${id}`;
    return axiosClient.get(url);
  },
  async getOrderId(id) {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },
  async rate(orderId, rating) {
    const url = `/restaurants/rate/${orderId}?rating=${rating}`;
    return axiosClient.post(url);
  },
};

export default OrderApi;
