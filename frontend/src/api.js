import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sopanparnateportfolio.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
