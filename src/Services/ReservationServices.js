import axios from 'axios';
const API_URL = import.meta.env.VITE_URL_API;

function createPaymentIntent(userId, promoCode) {
    return axios.post(API_URL + "/reservation/create-payment-intent", { userId, promoCode });
}

function getAllReservationByState(state) {
    return axios.get(API_URL + "/reservation/all/state/" + state );
}

function getMyReservationById(reservationId) {
    return axios.get(API_URL + "/reservation/me/" + reservationId);
}

function getMyReservation() {
    return axios.get(API_URL + "/reservation/me");
}

function getMyLastReservation() {
    return axios.get(API_URL + "/reservation/me/last");
}

function removeMyPastReservation() {
    return axios.delete(API_URL + "/reservation/me/remove-past-reservation");
}

function createReservation() {
    return axios.post(API_URL + "/reservation/create");
}

function confirmPayment(reservationId, reservationData) {
    return axios.post(API_URL + "/reservation/confirm-payment", { reservationId, reservationData });
}

function getReservationProducts(reservationId) {
    return axios.get(API_URL + "/reservationProducts/reservation/" + reservationId);
}

function applyPromoCode(promoCode, reservationId) {
    return axios.post(API_URL + "/reservation/apply-promo-code", { promoCode, reservationId });
}

function updateOrderStatus(reservationId, status) {
    return axios.patch(API_URL + "/reservation/update-status/" + reservationId, status);
}


export default {
    createPaymentIntent,
    getMyReservationById,
    createReservation,
    getReservationProducts,
    removeMyPastReservation,
    applyPromoCode,
    confirmPayment,
    getMyReservation,
    getMyLastReservation,
    getAllReservationByState,
    updateOrderStatus
};

