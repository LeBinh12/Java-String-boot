import axiosClient from "./src/api/axiosClient";
const RestaurantApi = {
  async getAll() {
    const url = "/restaurants/getAll";
    return axiosClient.get(url);
  },
};

export default RestaurantApi;
