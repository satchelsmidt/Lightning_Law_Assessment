import axios from 'axios';

//create function to grab wine
export function getWine() {
    return axios.get("https://lightninglaw.azurewebsites.net/api/reviews").then((res) => ({ success: true, message: 'Data Retrieved Successfully', data: res.data })).catch((res) => ({ success: false, message: null, data: res }));
}
