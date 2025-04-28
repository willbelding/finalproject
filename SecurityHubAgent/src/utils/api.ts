// This file is needed for axios HTTP client instance configuration with a
// base URL as well as an interceptor to add an auth token in the request
// automatically.
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API axios instance is created and a base URL is set for requests that
// are carried out with this instance. 
const API = axios.create({ 
    baseURL: 'http://192.168.1.133:5000/api', 
});

// Request interceptor is set to API instance and will be executed
// before every sent HTTP request.
API.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers['x-access-token'] = token;
    return config; }); // Returns modified request config
export default API;