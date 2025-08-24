import axios from "axios";
import { jwtDecode } from "jwt-decode";
const API_URL = import.meta.env.VITE_URL_API;

function login(user) {
    return axios.post(API_URL + "/auth/login", user)
}

function register(user) {
    return axios.post(API_URL + "/auth/register", user)
}

function logout() {
    localStorage.removeItem("authorization")
    delete axios.defaults.headers["authorization"]
}

function sendEmailToChangePassword(email){
    return axios.post(API_URL + "/auth/forgot-password", { email });
}

function resetPassword(token, password){
    return axios.post(API_URL + "/auth/reset-password", password, { headers: { Authorization: `Bearer ${token}` } });
}

function isConnected() {
    const token = localStorage.getItem("authorization")
    if (token) {
        const data = jwtDecode(token)
        if (data.exp * 1000 > new Date().getTime()) {
            axios.defaults.headers["authorization"] = "Bearer " + token
            return true
        }
    }
    logout()
    return false
}

function getRole() {
    const token = localStorage.getItem("authorization")
    if (token) {
        const data = jwtDecode(token)
        return data.admin
    }
    return null
}

function getUser() {
    const token = localStorage.getItem("authorization")
    if (token) {
        const data = jwtDecode(token)
        return {
            id: data.id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            admin: data.admin
        }
    }
    return null
}

export default {
    login,
    register,
    isConnected,
    getRole,
    getUser,
    logout,
    sendEmailToChangePassword,
    resetPassword
}