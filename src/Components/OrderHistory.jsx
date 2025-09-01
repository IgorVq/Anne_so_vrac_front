import { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import ReservationServices from "../Services/ReservationServices";
import "./styles/OrderHistory.css";
import OrderCard from "./cards/OrderCard";

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const [activeOrders, setActiveOrders] = useState([]);
    const [pastOrders, setPastOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("active");

    const fetchOrderHistory = async () => {
        if (user) {
            try {
                const response = await ReservationServices.getMyReservation();
                setPastOrders((response.data || []).filter(order => order.status === "withdrawn"));
                setActiveOrders((response.data || []).filter(order => order.status !== "withdrawn" && order.status !== "pending"));
            } catch (error) {
                console.error("Error fetching order history:", error);
            }
        }
    }

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    return (
        <div className="order-history">
            <div className="order-history-header">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === "active" ? "active" : ""}`}
                        onClick={() => setActiveTab("active")}
                    >
                        Active
                    </button>
                    <button
                        className={`tab ${activeTab === "past" ? "active" : ""}`}
                        onClick={() => setActiveTab("past")}
                    >
                        Passée
                    </button>
                </div>
            </div>
            <div className="order-history-content">
                {activeTab === "active" && (
                    <div className="d-flex flex-column gap-3 active-orders">
                        <div className="progress-indicator">
                            <div className="progress-step">
                                <div className="step-badge status-badge status-confirmed">Confirmée</div>
                                <div className="step-arrow">→</div>
                            </div>
                            <div className="progress-step">
                                <div className="step-badge status-badge status-preparation">En préparation</div>
                                <div className="step-arrow">→</div>
                            </div>
                            <div className="progress-step">
                                <div className="step-badge status-badge status-available">Disponible</div>
                                <div className="step-arrow">→</div>
                            </div>
                            <div className="progress-step">
                                <div className="step-badge status-badge status-withdrawn">Retirée</div>
                            </div>
                        </div>
                        {activeOrders.length > 0 ? (
                            activeOrders.map((order) => (
                                <OrderCard key={order.id_reservation} order={order} />
                            ))
                        ) : (
                            <p>Aucune commande active</p>
                        )}
                    </div>
                )}

                {activeTab === "past" && (
                    <div className="past-orders">
                        {pastOrders.length > 0 ? (
                            pastOrders.map((order) => (
                                <OrderCard key={order.id_reservation} order={order} />
                            ))
                        ) : (
                            <p>Aucune commande passée</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistory;
