import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://192.168.5.136:5001/api/v1" : "/api/v1",
    withCredentials: true,
});
