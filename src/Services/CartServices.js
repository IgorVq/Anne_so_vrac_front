import axios from 'axios';
const API_URL = import.meta.env.VITE_URL_API;

function getMyCart() {
    return axios.get(API_URL + '/cart/me/');
}

function addToCart(product) {
    return axios.post(API_URL + '/cart/me/', product);
}

function getCartInfoByCartId(cartId) {
    return axios.get(`${API_URL}/cart/info/${cartId}`);
}

function updateCartQuantity(cartId, quantity) {
    return axios.patch(`${API_URL}/cart/me/${cartId}`, { quantity: quantity });
}

function removeFromCart(cartId) {
    return axios.delete(`${API_URL}/cart/me/${cartId}`);
}

function clearCart(userId) {
    return axios.delete(`${API_URL}/cart/user/${userId}`);
}

export default {
    getMyCart,
    addToCart,
    getCartInfoByCartId,
    removeFromCart,
    updateCartQuantity,
    clearCart
}