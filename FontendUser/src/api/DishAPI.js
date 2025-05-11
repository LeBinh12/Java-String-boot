import axiosClient from "./axiosClient";
const dishApi = {
  async getAll(page = 0, size = 6) {
    const url = `/dishes/get-pagination?page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
  async get(id) {
    const url = `/dishes/get-id/${id}`;
    return axiosClient.get(url);
  },
  async getDishesCategory(categoryId, page = 0, size = 6, name = "", maxPrice) {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("size", size);

    if (categoryId !== null && categoryId !== undefined) {
      params.append("categoryId", categoryId);
    }

    if (name && name.trim() !== "") {
      params.append("name", name.trim());
    }

    if (maxPrice !== null && maxPrice !== undefined && maxPrice !== "") {
      params.append("maxPrice", maxPrice);
    }

    const url = `/dishes/search-pagination?${params.toString()}`;
    return axiosClient.get(url);
  },
};

export default dishApi;
