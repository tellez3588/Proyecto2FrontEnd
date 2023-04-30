import axios from "axios";

const API_URL = "http://localhost:4000/api/newsSource/";
let token = JSON.parse(localStorage.getItem('token'));
console.log(token)

const api = {
  getData: async () => {
    const response = await axios.get(API_URL, {
      headers:{'Authorization ': ' Bearer ' + token }
    });
    return response.data;
  },
  editData: async (item) => {
    const response = await axios.put(`${API_URL}${item._id}`, item, {
      headers:{'Authorization ' : ' Bearer ' + token }
    });
    return response.data;
  },
  deleteData: async (item) => {
    const response = await axios.delete(`${API_URL}${item._id}`, {
      headers:{'Authorization ' : ' Bearer ' + token }
    });
    return response.data;
  },
};

export default api;