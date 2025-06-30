import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1', // Using a relative URL for proxying
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default api;