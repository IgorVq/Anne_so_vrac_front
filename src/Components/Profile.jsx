import { useContext, useEffect, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import ReservationServices from "../Services/ReservationServices";
import OrderCard from "./cards/OrderCard";
import UserServices from "../Services/UserServices";

const Profile = () => {
    const [lastOrder, setLastOrder] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const { user } = useContext(AuthContext);

    const fetchLastOrder = async () => {
        if (user) {
            try {
                const response = await ReservationServices.getMyLastReservation();
                setLastOrder(response.data);
            } catch (error) {
                console.error("Error fetching last order:", error);
            }
        }
    }

    async function fetchUserDetails() {
        if (user) {
            try {
                const response = await UserServices.getMe();
                setUserDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }
    }

    useEffect(() => {
        fetchLastOrder();
        fetchUserDetails();
    }
    , [user]);
    
    return <>
        <div className="d-flex flex-column col-12 gap-2">
            <div className="col-12">
                <h2>Mes informations</h2>
                <div className="d-flex gap-3 justify-content-around d-none d-lg-flex" style={{ border: "1px solid #ced4da", padding: "20px", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
                    <div className="d-flex flex-column gap-2">
                        <span><strong>Prénom:</strong> {userDetails.first_name || "N/A"}</span>
                        <span><strong>Nom:</strong> {userDetails.last_name || "N/A"}</span>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <span><strong>Email:</strong> {userDetails.email || "N/A"}</span>
                        <span><strong>Téléphone:</strong> {userDetails.phone || "N/A"}</span>
                    </div>
                </div>
                
                {/* Version mobile - informations ligne par ligne */}
                <div className="d-flex d-lg-none flex-column gap-2" style={{ border: "1px solid #ced4da", padding: "20px", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
                    <span><strong>Prénom:</strong> {userDetails.first_name || "N/A"}</span>
                    <span><strong>Nom:</strong> {userDetails.last_name || "N/A"}</span>
                    <span><strong>Email:</strong> {userDetails.email || "N/A"}</span>
                    <span><strong>Téléphone:</strong> {userDetails.phone || "N/A"}</span>
                </div>
            </div>
            <div className="col-12 mt-2">
                <h2>Ma dernière commande</h2>
                { lastOrder ? (
                    <OrderCard order={lastOrder} />
                ) : (
                    <p>Aucune commande trouvée.</p>
                )}
            </div>
        </div>
    </>;
}
 
export default Profile;