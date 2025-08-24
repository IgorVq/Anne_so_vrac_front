import axios from 'axios';
const API_URL = import.meta.env.VITE_URL_API;

function getAvailableCategories() {
    return axios.get(`${API_URL}/categories/available`);
}

function getAllCategories() {
    return axios.get(`${API_URL}/categories`);
}

function getCategoryById(categoryId) {
    return axios.get(`${API_URL}/categories/${categoryId}`);
}

function createCategory(categoryData) {
    return axios.post(`${API_URL}/categories`, categoryData);
}

function updateCategory(categoryId, categoryData) {
    return axios.patch(`${API_URL}/categories/${categoryId}`, categoryData);
}

function deleteCategory(categoryId) {
    return axios.delete(`${API_URL}/categories/${categoryId}`);
}

export default {
    getAvailableCategories,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
