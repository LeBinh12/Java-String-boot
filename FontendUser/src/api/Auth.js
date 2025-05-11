import axiosClient from "./axiosClient";
const AuthApi = {
  async login(data) {
    const url = "/user/login";
    return axiosClient.post(url, data);
  },
  async register(data) {
    const url = "/user/register";
    return axiosClient.post(url, data);
  },
};

export default AuthApi;
