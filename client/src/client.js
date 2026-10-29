import axios from 'axios';

const urlPrefix = axios.create({
  // Vite injects the string here automatically
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default urlPrefix;