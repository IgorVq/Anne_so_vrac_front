import { useEffect, useState } from "react";
import ReservationServices from "../../Services/ReservationServices";
import AdminOrderCard from "../cards/AdminOrderCard";

const ToPickupOrderPanel = () => {
const [toPickupOrders, setToPickupOrders] = useState([]);

    const fetchToPickupOrders = async () => {
        try {
            const orders = await ReservationServices.getAllReservationByState("available");
            setToPickupOrders(orders.data);

        }
        catch (error) {
            console.error("Error fetching to pickup orders:", error);
        }
    }

    useEffect(() => {
        fetchToPickupOrders();
    }, []);

    return <>
    { toPickupOrders.length > 0 ? <>
        <div className="d-flex flex-column gap-3">
            {toPickupOrders.map(order => (
                    <AdminOrderCard key={order.id_reservation} order={order} />
                ))}
                </div>
    </>
    : <p>Aucune commande à traiter pour le moment.</p> }

    </>;
}

export default ToPickupOrderPanel;