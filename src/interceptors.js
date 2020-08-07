var axios = require("axios");

axios.interceptors.request.use(async(config) => {
    if (
        !config.url.endsWith('login')
    ) {
        const jwtToken = localStorage.getItem("authorization");
        if(jwtToken !== null && jwtToken !== undefined) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});