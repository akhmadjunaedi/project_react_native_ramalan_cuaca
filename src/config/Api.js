import axios from "axios";

// export const APIKEY = '9fc8195ffdbde74582b0ae123dd22ed2';
export const APIKEY = '3fa40d0d4a239cad8a4b6af64babd7ce';

const API = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
    timeout: 10000
});

export default API;