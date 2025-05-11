import axiosClient from "./axiosClient";
const dishCategoryApi = {
  getAllDishCategories() {
    const url = "/categories/getAll";
    return axiosClient.get(url);
  },
  getDishCategories(name = "", page = 0, size = 5) {
    const url = `/categories/get-pagination?name=${name}&page=${page}&size=${size}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = "/categories/add";
    return axiosClient.post(url, data);
  },
  update(data, id) {
    const url = `/categories/update/${id}`;
    return axiosClient.put(url, data);
  },
  delete(data) {
    const url = `/categories/delete/${data}`;
    return axiosClient.delete(url);
  },
};

export default dishCategoryApi;
