import axios from 'axios';

// Create an Axios instance
const axiosClient = axios.create({
    baseURL: '',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});


axiosClient.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;
