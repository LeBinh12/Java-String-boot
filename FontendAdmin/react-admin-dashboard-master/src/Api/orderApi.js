import axiosClient from "./axiosClient";
const orderApi = {
  getOrder(search = " ", page = 0, size = 5) {
    const url = `/orders/search-pagination?search=${search}&page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
  getOrderById(id) {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },
  getOrderItemById(id) {
    const url = `/orders-item/get-by-order/${id}`;
    return axiosClient.get(url);
  },
  getStatusPay(id) {
    const url = `/payment/by-order/${id}`;
    return axiosClient.get(url);
  },
  start() {
    const url = `/orders/today-stats`;
    return axiosClient.get(url);
  },
  ChangeStatus(id) {
    const url = `/orders/change-status/${id}`;
    return axiosClient.put(url);
  },
  update(id, data) {
    const url = `/orders/update/${id}`;
    return axiosClient.put(url, data);
  },
  delete(id) {
    const url = `/orders/delete/${id}`;
    return axiosClient.delete(url);
  },
};

export default orderApi;
