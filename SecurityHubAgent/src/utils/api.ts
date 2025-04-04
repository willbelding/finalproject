import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({ 
    baseURL: 'http://192.168.1.133:5000/api', 
});

API.interceptors.request.use(async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers['x-access-token'] = token;
    return config; });

export default API;