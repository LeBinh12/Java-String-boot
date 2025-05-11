import axiosClient from "./axiosClient";
const OrderHistoryApi = {
  async add(data) {
    const url = "/order-history";
    return axiosClient.post(url, data);
  },
  async getByUserId(id) {
    const url = `/order-history/user/${id}`;
    return axiosClient.get(url);
  },
  async delete(id) {
    const url = `/order-history/${id}`;
    return axiosClient.delete(url);
  },
};

export default OrderHistoryApi;
