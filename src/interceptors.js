import axios from "axios";
import { history } from "./App";

axios.interceptors.request.use(async(config) => {
    if (
        !config.url.endsWith('login')
    ) {
        const jwtToken = localStorage.getItem("token");
        const jwtTokenExpDate = localStorage.getItem("expDate");
        if(jwtToken !== null && jwtToken !== undefined && Date.parse(jwtTokenExpDate) > Date.now()) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if(error.response.status === 401) {
        alert('ERRO: Token expirado');
        history.push('/login');
    }
    return Promise.reject(error);
});