import axiosClient from "./axiosClient";
const dishApi = {
  getAllDishes() {
    const url = "/dishes/getAll";
    return axiosClient.get(url);
  },
  getDishes(name = "", page = 0, size = 5) {
    const url = `/dishes/get-pagination?name=${name}&page=${page}&size=${size}`;
    return axiosClient.get(url);
  },

  getDishesCategory(name = "", page = 0, size = 5) {
    const url = `/dishes/get-pagination?name=${name}&page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
  getTotal() {
    const url = `/dishes/total-price`;
    return axiosClient.get(url);
  },
  getCount() {
    const url = `/dishes/get-count`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = "/dishes/add";
    return axiosClient.post(url, data);
  },
  update(data, id) {
    const url = `/dishes/update/${id}`;
    console.log("Data edit:", data);
    console.log("Data edit id:", id);
    return axiosClient.put(url, data);
  },
  delete(data) {
    const url = `/dishes/delete/${data}`;
    return axiosClient.delete(url);
  },
};

export default dishApi;
