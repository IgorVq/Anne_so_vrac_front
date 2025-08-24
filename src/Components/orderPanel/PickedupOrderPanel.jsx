import { useEffect, useState } from "react";
import ReservationServices from "../../Services/ReservationServices";
import AdminOrderCard from "../cards/AdminOrderCard";

const PickedupOrderPanel = () => {
const [pickedupOrders, setPickedupOrders] = useState([]);

    const fetchPickedupOrders = async () => {
        try {
            const orders = await ReservationServices.getAllReservationByState("withdrawn");
            setPickedupOrders(orders.data);

        }
        catch (error) {
            console.error("Error fetching picked up orders:", error);
        }
    }

    useEffect(() => {
        fetchPickedupOrders();
    }, []);

    return <>
    { pickedupOrders.length > 0 ? <>
        <div className="d-flex flex-column gap-3">
            {pickedupOrders.map(order => (
                    <AdminOrderCard key={order.id_reservation} order={order} />
                ))}
                </div>
    </>
    : <p>Aucune commande à traiter pour le moment.</p> }

    </>;
}

export default PickedupOrderPanel;