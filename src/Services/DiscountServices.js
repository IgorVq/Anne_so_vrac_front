import axios from 'axios';

const API_URL = import.meta.env.VITE_URL_API;

function getAllDiscounts() {
    return axios.get(`${API_URL}/discounts`);
}

function getProductDiscounts(productId) {
    return axios.get(`${API_URL}/discounts/product/${productId}`);
}

function createDiscount(discountData) {
    return axios.post(`${API_URL}/discounts`, discountData);
}

function updateDiscount(discountId, discountData) {
    return axios.patch(`${API_URL}/discounts/${discountId}`, discountData);
}

function deleteDiscount(discountId) {
    return axios.delete(`${API_URL}/discounts/${discountId}`);
}

export default {
    getAllDiscounts,
    getProductDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount
};
