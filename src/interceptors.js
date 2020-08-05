var axios = require("axios");

axios.interceptors.request.use(async(config) => {
    console.log('-----<interceptor>-----');
    console.log(config);
    console.log('-----</interceptor>-----');
    if (
        !config.url.endsWith('login')
    ) {
        console.log('dentro do if');
        const jwtToken = localStorage.getItem("authorization");
        if(jwtToken !== null && jwtToken !== undefined) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});