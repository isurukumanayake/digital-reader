import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://digitalreader-api.onrender.com/api/v1/',
});

export default apiClient;
