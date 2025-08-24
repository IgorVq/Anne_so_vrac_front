import axios from 'axios';
const API_URL = import.meta.env.VITE_URL_API;

function applyPromoCode(promoCode) {
    return axios.get(API_URL + "/promoCode/code/" + promoCode);
}

function checkPromoCodeValidity(promoCode) {
    return axios.get(API_URL + "/promoCode/validity/" + promoCode);
}

function getPromoCodeById(promoCodeId) {
    return axios.get(API_URL + "/promoCode/" + promoCodeId);
}

function getAllPromoCodes() {
    return axios.get(API_URL + "/promoCode");
}

function createPromoCode(promoCodeData) {
    return axios.post(API_URL + "/promoCode", promoCodeData);
}

function updatePromoCode(promoCodeId, promoCodeData) {
    return axios.patch(API_URL + "/promoCode/" + promoCodeId, promoCodeData);
}

function deletePromoCode(promoCodeId) {
    return axios.delete(API_URL + "/promoCode/" + promoCodeId);
}

export default {
    applyPromoCode,
    checkPromoCodeValidity,
    getPromoCodeById,
    getAllPromoCodes,
    createPromoCode,
    updatePromoCode,
    deletePromoCode
};
