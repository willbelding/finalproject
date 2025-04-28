// This file is needed to make API requests.
import axios from 'axios'; // Imports axios HTTP client to enable API request making

// This creates an axios instance with the base URL of my backend API.
const api = axios.create({
  baseURL: 'http://192.168.1.133:5000/api', // My backend API
});

// Exports the instance to allow other modules and components to import and use.
export default api;