import axiosClient from "./axiosClient";
const PayApi = {
  async add(userId, orderId, depositAmount) {
    const url = `/payment/create?orderId=${orderId}&userId=${userId}&depositAmount=${depositAmount}`;
    console.log("Url Pay", url);
    return axiosClient.post(url);
  },
  async webhook(data) {
    const url = `/payment/webhook`;
    return axiosClient.post(url, data);
  },
  async getTransactionStatus(id) {
    const url = `/payment/status/${id}`;
    return axiosClient.get(url);
  },
};

export default PayApi;
