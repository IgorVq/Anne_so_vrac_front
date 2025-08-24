import { useEffect, useState } from "react";
import ReservationServices from "../../Services/ReservationServices";
import AdminOrderCard from "../cards/AdminOrderCard";

const TodoOrderPanel = () => {

    const [todoOrders, setTodoOrders] = useState([]);

    const fetchTodoOrders = async () => {
        try {
            const orders = await ReservationServices.getAllReservationByState("confirmed");
            setTodoOrders(orders.data);

        }
        catch (error) {
            console.error("Error fetching todo orders:", error);
        }
    }

    useEffect(() => {
        fetchTodoOrders();
    }, []);

    return <>
    { todoOrders.length > 0 ? <>
        <div className="d-flex flex-column gap-3">
            {todoOrders.map(order => (
                    <AdminOrderCard key={order.id_reservation} order={order} />
                ))}
                </div>
    </>
    : <p>Aucune commande à traiter pour le moment.</p> }
    
    </>;
}

export default TodoOrderPanel;