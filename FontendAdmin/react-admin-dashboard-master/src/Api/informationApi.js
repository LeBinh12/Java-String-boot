import axiosClient from "./axiosClient";

const informationApi = {
  getPagination(page = 0, size = 5) {
    const url = `/information?page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
  add(data) {
    const url = `/information/create`;
    return axiosClient.post(url, data);
  },
  update(data, id) {
    const url = `/information/edit/${id}`;
    return axiosClient.put(url, data);
  },
  delete(id) {
    const url = `/information/${id}`;
    return axiosClient.delete(url);
  },
};

export default informationApi;
