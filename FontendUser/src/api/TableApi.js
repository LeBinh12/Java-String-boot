import axiosClient from "./axiosClient";
const TableApi = {
  async getByRestaurantId(id) {
    const url = `/tables/get-table-restaurant/${id}`;
    return axiosClient.get(url);
  },
};

export default TableApi;
