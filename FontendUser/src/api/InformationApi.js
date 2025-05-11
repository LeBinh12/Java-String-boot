import axiosClient from "./axiosClient";

const InformationApi = {
  async getPagination(page = 0, size = 5) {
    const url = `/information?page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
};

export default InformationApi;
