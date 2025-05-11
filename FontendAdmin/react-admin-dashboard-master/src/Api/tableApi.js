import axiosClient from "./axiosClient";
const tableApi = {
  getAllTables() {
    const url = "/tables/getAll";
    return axiosClient.get(url);
  },
  getTables(name = "", page = 0, size = 5) {
    const url = `/tables/get-pagination?page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
  getTablesByRestaurant(restaurantId) {
    const url = `/tables/get-table-restaurant/${restaurantId}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = "/tables/add";
    return axiosClient.post(url, data);
  },
  update(data, id) {
    const url = `/tables/update/${id}`;
    console.log("Data edit:", data);
    console.log("Data edit id:", id);
    return axiosClient.put(url, data);
  },
  delete(data) {
    const url = `/tables/delete/${data}`;
    return axiosClient.delete(url);
  },
};

export default tableApi;
