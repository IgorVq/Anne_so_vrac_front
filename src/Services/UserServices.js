import axios from 'axios';
const API_URL = import.meta.env.VITE_URL_API;

function sendContactEmail(email){
    return axios.post(API_URL + "/users/contact", email);
}

function getMe() {
    return axios.get(API_URL + "/users/me");
}

function updateUserDetails(userDetails) {
    return axios.patch(API_URL + "/users/me", userDetails);
}

export default {
    sendContactEmail,
    getMe,
    updateUserDetails
}