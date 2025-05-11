import axiosClient from "./axiosClient";
const CategoryApi = {
  async getAll() {
    const url = "/categories/getAll";
    return axiosClient.get(url);
  },
};

export default CategoryApi;
