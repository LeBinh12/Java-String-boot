import axiosClient from "./axiosClient";
const OrderItemApi = {
  async add(data) {
    const url = "/orders-item/add";
    return axiosClient.post(url, data);
  },
  async getOrderById(id) {
    const url = `/orders-item/get-by-order/${id}`;
    return axiosClient.get(url);
  },
};

export default OrderItemApi;
