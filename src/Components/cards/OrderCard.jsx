import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import ReservationServices from "../../Services/ReservationServices";
import OrderProductCard from "./OrderProductCard";
import PromoCodeServices from "../../Services/PromoCodeServices";
import "../styles/OrderCard.css";

const OrderCard = ({ order }) => {
    const [statusText, setStatusText] = useState("");
    const [reservationProducts, setReservationProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [promoCode, setPromoCode] = useState(null);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "confirmed":
                return "status-badge status-confirmed"; 
            case "preparation":
                return "status-badge status-preparation"; 
            case "available":
                return "status-badge status-available"; 
            case "withdrawn":
                return "status-badge status-withdrawn";
            default:
                return "status-badge status-unknown";
        }
    };

    const initOrderDetails = async () => {
        try {
            const result = await ReservationServices.getReservationProducts(order.id_reservation);
            setTotalPrice(order.total_price);
            setReservationProducts(result.data);
            if (order.id_promo_code) {
                const promoCode = await PromoCodeServices.getPromoCodeById(order.id_promo_code);
                setPromoCode(promoCode.data);
                setTotalPrice(parseFloat(order.total_price * (1 - promoCode.data.discount)).toFixed(2));
            }
        }
        catch (error) {
            console.error("Error initializing order details:", error);
        }
    }

    useEffect(() => {
        if (order.status === "confirmed") {
            setStatusText("Confirmée");
        } else if (order.status === "preparation") {
            setStatusText("En préparation");
        } else if (order.status === "available") {
            setStatusText("Disponible");
        } else if (order.status === "withdrawn") {
            setStatusText("Retirée");
        } else {
            setStatusText("Statut inconnu");
        }
        initOrderDetails();
    }
    , [order]);

    return <>
    <Card>
        <Card.Body>
            <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Commande n°{order.id_reservation}</span>
                <span className={getStatusBadgeClass(order.status)}>{statusText}</span>
            </Card.Title>
            <Card.Text>
                <strong>Date :</strong> {new Date(order.reservation_date).toLocaleDateString()}<br />
                <strong>Total :</strong> {parseFloat(order.total_price).toFixed(2)}€ {promoCode && <span style={{fontSize: "0.9rem", color: "lightgray"}}>({promoCode.code}: -{promoCode.discount_percent}%)</span>}
            </Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
            <div className="d-flex flex-wrap">
                {reservationProducts.map((item, index) => (
                    <OrderProductCard key={index} item={item} />
                ))}
            </div>
        </Card.Footer>
    </Card>
    </>;
}
 
export default OrderCard;