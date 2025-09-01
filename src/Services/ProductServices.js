import axios from "axios";
const API_URL = import.meta.env.VITE_URL_API;

function getProductsById(productId) {
    return axios.get(`${API_URL}/products/${productId}`);
}

function getImageByProductId(productId) {
    return axios.get(`${API_URL}/productImage/product/${productId}`);
}

function getProductSizeByProductId(productId) {
    return axios.get(`${API_URL}/Format/productSize/${productId}`);
} 

function getAvailableProducts() {
    return axios.get(`${API_URL}/products/available`);
}

function getAvailablePromoProducts() {
    return axios.get(`${API_URL}/products/available/promo`);
}

function getAvailableLocalProducts() {
    return axios.get(`${API_URL}/products/available/local`);
}

function getProductCardInfo(productId) {
    return axios.get(`${API_URL}/products/card/${productId}`);
}

function getAvailableProductsByCategory(category) {
    return axios.get(`${API_URL}/products/available/category/${category}`);
}

function searchProducts(query) {
    return axios.get(`${API_URL}/products/search`, {
        params: { q: query }
    });
}

function getProductsForAdmin() {
    return axios.get(`${API_URL}/products/admin`);
}

function getProductForAdmin(productId) {
    return axios.get(`${API_URL}/products/admin/${productId}`);
}

function getProducts() {
    return axios.get(`${API_URL}/products`);
}

function createProductAdmin(productData) {
    return axios.post(`${API_URL}/products/admin`, productData);
}

function updateProductAdmin(productId, productData) {
    return axios.patch(`${API_URL}/products/admin/${productId}`, productData);
}

function deleteProductAdmin(productId) {
    return axios.delete(`${API_URL}/products/admin/${productId}`);
}

function createProduct(productData) {
    return axios.post(`${API_URL}/products`, productData);
}

function updateProduct(productId, productData) {
    return axios.patch(`${API_URL}/products/${productId}`, productData);
}

function deleteProduct(productId) {
    return axios.delete(`${API_URL}/products/${productId}`);
}

function createFormat(formatData) {
    return axios.post(`${API_URL}/Format`, formatData);
}

function updateFormat(formatId, formatData) {
    return axios.patch(`${API_URL}/Format/${formatId}`, formatData);
}

function deleteFormat(formatId) {
    return axios.delete(`${API_URL}/Format/${formatId}`);
}

function createProductImage(imageData) {
    return axios.post(`${API_URL}/productImage`, imageData);
}

function updateProductImage(imageId, imageData) {
    return axios.patch(`${API_URL}/productImage/${imageId}`, imageData);
}

function deleteProductImage(imageId) {
    return axios.delete(`${API_URL}/productImage/${imageId}`);
}

function addProductPromotion(productId, promoId) {
    return axios.post(`${API_URL}/products/${productId}/promotions`, { promotion_id: promoId });
}

function removeProductPromotion(productId, promoId) {
    return axios.delete(`${API_URL}/products/${productId}/promotions/${promoId}`);
}

function getProductDiscounts(productId) {
    return axios.get(`${API_URL}/discounts/product/${productId}`);
}

function getAllDiscounts() {
    return axios.get(`${API_URL}/discounts`);
}

function getProductPromotions(productId) {
    return axios.get(`${API_URL}/products/${productId}/promotions`);
}

function getProductComplete(productId) {
    return axios.get(`${API_URL}/products/${productId}/complete`);
}

export default {
    getProductsById,
    getImageByProductId,
    getProductSizeByProductId,
    getAvailableProducts,
    getProductCardInfo,
    getAvailablePromoProducts,
    getAvailableLocalProducts,
    getAvailableProductsByCategory,
    searchProducts,
    getProducts,
    getProductsForAdmin,
    getProductForAdmin,
    createProduct,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin,
    updateProduct,
    deleteProduct,
    createFormat,
    updateFormat,
    deleteFormat,
    createProductImage,
    updateProductImage,
    deleteProductImage,
    addProductPromotion,
    removeProductPromotion,
    getProductPromotions,
    getProductDiscounts,
    getAllDiscounts,
    getProductComplete
};