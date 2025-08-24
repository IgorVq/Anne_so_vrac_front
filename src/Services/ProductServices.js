import axios from "axios";
const API_URL = import.meta.env.VITE_URL_API;

// ===== MÉTHODES EXISTANTES =====
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

// ===== NOUVELLES MÉTHODES POUR LE CRUD ADMIN =====

// Récupérer tous les produits avec toutes leurs relations (pour l'admin)
function getProductsForAdmin() {
    return axios.get(`${API_URL}/products/admin`);
}

// Récupérer un produit complet avec toutes ses relations (pour l'admin)
function getProductForAdmin(productId) {
    return axios.get(`${API_URL}/products/admin/${productId}`);
}

// Récupérer tous les produits (pour l'admin)
function getProducts() {
    return axios.get(`${API_URL}/products`);
}

// Créer un nouveau produit avec toutes ses relations (admin)
function createProductAdmin(productData) {
    return axios.post(`${API_URL}/products/admin`, productData);
}

// Mettre à jour un produit avec toutes ses relations (admin)
function updateProductAdmin(productId, productData) {
    return axios.patch(`${API_URL}/products/admin/${productId}`, productData);
}

// Supprimer un produit et toutes ses relations (admin)
function deleteProductAdmin(productId) {
    return axios.delete(`${API_URL}/products/admin/${productId}`);
}

// Créer un nouveau produit
function createProduct(productData) {
    return axios.post(`${API_URL}/products`, productData);
}

// Mettre à jour un produit existant
function updateProduct(productId, productData) {
    return axios.patch(`${API_URL}/products/${productId}`, productData);
}

// Supprimer un produit
function deleteProduct(productId) {
    return axios.delete(`${API_URL}/products/${productId}`);
}

// Gestion des formats
function createFormat(formatData) {
    return axios.post(`${API_URL}/Format`, formatData);
}

function updateFormat(formatId, formatData) {
    return axios.patch(`${API_URL}/Format/${formatId}`, formatData);
}

function deleteFormat(formatId) {
    return axios.delete(`${API_URL}/Format/${formatId}`);
}

// Gestion des images produit
function createProductImage(imageData) {
    return axios.post(`${API_URL}/productImage`, imageData);
}

function updateProductImage(imageId, imageData) {
    return axios.patch(`${API_URL}/productImage/${imageId}`, imageData);
}

function deleteProductImage(imageId) {
    return axios.delete(`${API_URL}/productImage/${imageId}`);
}

// Gestion des relations produit-promotions
function addProductPromotion(productId, promoId) {
    return axios.post(`${API_URL}/products/${productId}/promotions`, { promotion_id: promoId });
}

function removeProductPromotion(productId, promoId) {
    return axios.delete(`${API_URL}/products/${productId}/promotions/${promoId}`);
}

// Récupérer les promotions d'un produit spécifique (discounts)
function getProductDiscounts(productId) {
    return axios.get(`${API_URL}/discounts/product/${productId}`);
}

// Récupérer tous les discounts
function getAllDiscounts() {
    return axios.get(`${API_URL}/discounts`);
}

// Récupérer les promotions d'un produit spécifique
function getProductPromotions(productId) {
    return axios.get(`${API_URL}/products/${productId}/promotions`);
}

// Récupérer toutes les informations complètes d'un produit (avec relations)
function getProductComplete(productId) {
    return axios.get(`${API_URL}/products/${productId}/complete`);
}

export default {
    // Méthodes existantes
    getProductsById,
    getImageByProductId,
    getProductSizeByProductId,
    getAvailableProducts,
    getProductCardInfo,
    getAvailablePromoProducts,
    getAvailableLocalProducts,
    getAvailableProductsByCategory,
    searchProducts,
    
    // Nouvelles méthodes CRUD
    getProducts,
    getProductsForAdmin,
    getProductForAdmin,
    createProduct,
    createProductAdmin,
    updateProductAdmin,
    deleteProductAdmin,
    updateProduct,
    deleteProduct,
    
    // Gestion des formats
    createFormat,
    updateFormat,
    deleteFormat,
    
    // Gestion des images
    createProductImage,
    updateProductImage,
    deleteProductImage,
    
    // Gestion des promotions
    addProductPromotion,
    removeProductPromotion,
    getProductPromotions,
    getProductDiscounts,
    getAllDiscounts,
    
    // Méthode complète
    getProductComplete
};