import axios from 'axios';

const API_URL = import.meta.env.VITE_URL_API;

// Récupérer tous les discounts
function getAllDiscounts() {
    return axios.get(`${API_URL}/discounts`);
}

// Récupérer les discounts d'un produit spécifique
function getProductDiscounts(productId) {
    return axios.get(`${API_URL}/discounts/product/${productId}`);
}

// Créer un discount pour un produit
function createDiscount(discountData) {
    return axios.post(`${API_URL}/discounts`, discountData);
}

// Mettre à jour un discount
function updateDiscount(discountId, discountData) {
    return axios.patch(`${API_URL}/discounts/${discountId}`, discountData);
}

// Supprimer un discount
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
