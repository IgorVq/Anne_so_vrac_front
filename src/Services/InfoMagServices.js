import axios from 'axios';
const API_URL = import.meta.env.VITE_URL_API;

function getTopBannerMessages() {
    return axios.get(API_URL + '/infomag');
}

function getAllInfoMags() {
    return axios.get(API_URL + '/infomag');
}

function getInfoMagById(id) {
    return axios.get(API_URL + '/infomag/' + id);
}

function createInfoMag(infoMagData) {
    return axios.post(API_URL + '/infomag', infoMagData);
}

function updateInfoMag(id, infoMagData) {
    return axios.patch(API_URL + '/infomag/' + id, infoMagData);
}

function deleteInfoMag(id) {
    return axios.delete(API_URL + '/infomag/' + id);
}

function getTopbarMessages() {
    return axios.get(API_URL + '/infoMag/topbar/messages');
}

function createTopbarMessage(messageData) {
    return axios.post(API_URL + '/infoMag/topbar', messageData);
}

function updateTopbarMessage(id, messageData) {
    return axios.patch(API_URL + '/infoMag/topbar/' + id, messageData);
}

function deleteTopbarMessage(id) {
    return axios.delete(API_URL + '/infoMag/topbar/' + id);
}

export default {
    getTopBannerMessages,
    getAllInfoMags,
    getInfoMagById,
    createInfoMag,
    updateInfoMag,
    deleteInfoMag,
    getTopbarMessages,
    createTopbarMessage,
    updateTopbarMessage,
    deleteTopbarMessage
}