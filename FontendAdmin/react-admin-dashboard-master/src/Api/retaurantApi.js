import axiosClient from "./axiosClient";
const restaurantApi = {
  getAllRestaurants() {
    const url = "/restaurants/getAll";
    return axiosClient.get(url);
  },
  getRestaurants(name = "", page = 0, size = 5) {
    const url = `/restaurants/get-pagination?name=${name}&page=${page}&size=${size}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = "/restaurants/add";
    return axiosClient.post(url, data);
  },
  update(data, id) {
    const url = `/restaurants/edit/${id}`;
    return axiosClient.put(url, data);
  },
  delete(data) {
    const url = `/restaurants/delete/${data}`;
    return axiosClient.delete(url);
  },
};

export default restaurantApi;
