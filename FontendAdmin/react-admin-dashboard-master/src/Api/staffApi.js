import axiosClient from "./axiosClient";
const staffApi = {
  getAllStaffs() {
    const url = "/staffs/getAll";
    return axiosClient.get(url);
  },
  getStaffs(name = "", page = 0, size = 5) {
    const url = `/staffs/get-pagination?name=${name}&page=${page}&size=${size}`;
    return axiosClient.get(url);
  },
  getCount() {
    const url = `/staffs/get-count`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = "/staffs/add";
    return axiosClient.post(url, data);
  },
  update(data, id) {
    const url = `/staffs/update/${id}`;
    console.log("Data edit:", data);
    console.log("Data edit id:", id);
    return axiosClient.put(url, data);
  },
  delete(data) {
    const url = `/staffs/delete/${data}`;
    return axiosClient.delete(url);
  },
};

export default staffApi;
