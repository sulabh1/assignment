import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "https://hn.algolia.com/api/v1",
  maxContentLength: 2,
  maxBodyLength: 1,
  headers: {
    "Content-type": "application/json",
  },
});

export default axiosConfig;
