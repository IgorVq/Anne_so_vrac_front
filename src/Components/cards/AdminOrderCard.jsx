import { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import ReservationServices from "../../Services/ReservationServices";
import OrderProductCard from "./OrderProductCard";
import PromoCodeServices from "../../Services/PromoCodeServices";
import "../styles/OrderCard.css";

const AdminOrderCard = ({ order }) => {
    const [statusText, setStatusText] = useState("");
    const [reservationProducts, setReservationProducts] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [promoCode, setPromoCode] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [showModal, setShowModal] = useState(false);



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

    const manageOrderStatus = async () => {
        try {
            if (order.status === "confirmed") {
                await ReservationServices.updateOrderStatus(order.id_reservation, { status: "available" });
                setIsVisible(false);
            } else if (order.status === "available") {
                await ReservationServices.updateOrderStatus(order.id_reservation, { status: "withdrawn" });
                setIsVisible(false);
            }
            initOrderDetails();
        } catch (error) {
            console.error("Error managing order status:", error);
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleConfirmAction = () => {
        setShowModal(false);
        manageOrderStatus();
    }

    useEffect(() => {
        if (order.status === "confirmed") {
            setStatusText("Marquer comme prête");
        } else if (order.status === "available") {
            setStatusText("Marquer comme récupérée");
        } else if (order.status === "withdrawn") {
            setStatusText("Retirée");
        } else {
            setStatusText("Statut inconnu");
        }
        initOrderDetails();
    }
    , [order]);

    if (!isVisible) {
        return null;
    }

    return <>
    <Card>
        <Card.Body>
            <Card.Title className="d-flex justify-content-between align-items-center">
                <span>Commande n°{order.id_reservation}</span>
                {
                    <Button variant={order.status === "confirmed" || order.status === "available" ? "success" : "secondary"} size="sm" onClick={handleShowModal}>{statusText}</Button>
                }
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

    <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Êtes-vous sûr de vouloir {statusText.toLowerCase()} cette commande ?
        </Modal.Body>
        <Modal.Footer>
            <Button variant="danger" onClick={handleCloseModal}>
                Annuler
            </Button>
            <Button variant="success" onClick={handleConfirmAction}>
                Confirmer
            </Button>
        </Modal.Footer>
    </Modal>
    </>;
}
 
export default AdminOrderCard;