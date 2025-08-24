import { useContext, useEffect, useState, useRef } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import UserServices from "../Services/UserServices";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from "../Components/PaymentForm";
import brandIcon from "../assets/brand.png";
import confirmIcon from "../assets/check-mark.png";
import ProductReservationCard from "../Components/cards/ProductReservationCard";
import PromoCodeServices from "../Services/PromoCodeServices";
import { toast } from "react-toastify";
import ReservationServices from "../Services/ReservationServices";
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const ConfirmationPage = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const reservationData = location.state?.reservationData;
    const [userDetails, setUserDetails] = useState({});
    const [total, setTotal] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [promoCodeData, setPromoCodeData] = useState(null);
    const navigate = useNavigate();

    const initConfirmInfo = async () => {
        try {
            const totalPrice = parseFloat(reservationData.reservation.total_price) || 0;
            setTotal(totalPrice);
            setSubTotal(totalPrice);
            if (reservationData.reservation.id_promo_code) {
                const promocode = await PromoCodeServices.getPromoCodeById(reservationData.reservation.id_promo_code);
                if (promocode) {
                    setPromoCodeData(promocode.data);
                    const discountAmount = totalPrice * promocode.data.discount_percent / 100;
                    setTotal(totalPrice - discountAmount);
                }

            }
        } catch (error) {
            console.error("Erreur lors de la récupération du code promo :", error);
            toast.error("Erreur lors de la récupération du code promo.");
        }
    };

    useEffect(() => {
        if (!reservationData) {
            toast.error("Aucune donnée de réservation trouvée.");
            return;
        }
        initConfirmInfo();
    }, [reservationData]);

    useEffect(() => {
        if (user) {
            (async () => {
                const response = await UserServices.getMe();
                setUserDetails(response.data);
            })();
        }
    }, [user]);


    return (
        <>
            {/* Version Desktop */}
            <div className="d-none d-lg-flex flex-grow-1">
                <Container className="col-7 flex-grow-1">
                    <div className="d-flex flex-column align-items-center justify-content-center my-4">
                        <Image src={brandIcon} alt="Brand" style={{ height: 58 }} />
                    </div>
                    <div className="p-3 d-flex flex-column align-items-center">
                        <h4 className="text-center mb-4">Merci {userDetails.first_name}, ta réservation est confirmée !</h4>
                        <p style={{ color: "lightgray" }}>Référence du paiment:</p>
                        <p style={{ color: "lightgray" }}>{reservationData.reservation.id_payment_intent}</p>
                        <div className="d-flex flex-column align-items-center justify-content-center mb-4">
                            <Image src={confirmIcon} alt="Confirmation" style={{ height: 120 }} />
                        </div>
                        <p>Tu recevras un mail lorsque ta commande sera prête.</p>
                        <br /> 
                        <p>(Ne pas confondre avec le mail de confirmation de paiment qui vient de t'être envoyé)</p>
                        <br />
                        <Button onClick={() => navigate("/")} className="mt-3" variant="primary">Retour à l'accueil</Button>
                    </div>
                </Container>
                <Container style={{ borderLeft: '1px solid #dee2e6', backgroundColor: "#f8f9fa" }} className="col-5 py-3 gap-3 d-flex flex-column justify-content-start flex-grow-1">
                    {reservationData.reservationProducts.map((item, index) => (
                        <ProductReservationCard key={`${item.id_product}-${item.id_product_size}-${index}`} item={item} />
                    ))}
                    <div className="d-flex flex-column gap-4 p-2">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <span>Sous-total {(reservationData.reservationProducts).length} {(reservationData.reservationProducts).length > 1 ? "articles" : "article"}</span>
                            <span>{(typeof subTotal === 'number' ? subTotal.toFixed(2) : '0.00')} €</span>
                        </div>
                        {promoCodeData && (
                            <div className="d-flex justify-content-between align-items-center w-100 text-sucess">
                                <span className="text-success">{promoCodeData.code}</span>
                                <span className="text-success">-{(typeof subTotal === 'number' ? (subTotal * promoCodeData.discount_percent / 100).toFixed(2) : '0.00')} €</span>
                            </div>
                        )}
                        <div className="d-flex flex-column w-100">
                            <div className="d-flex justify-content-between align-items-center w-100" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                                <span>Total</span>
                                <span>{(typeof total === 'number' ? total.toFixed(2) : '0.00')} €</span>
                            </div>
                            <p style={{ color: "lightgray", fontSize: "0.85rem" }}>Taxes de {(typeof total === 'number' ? (total * 0.2).toFixed(2) : '0.00')} € incluses</p>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Version Mobile */}
            <div className="d-flex d-lg-none flex-column flex-grow-1">
                {/* Premier bloc - Confirmation */}
                <Container className="mb-4">
                    <div className="d-flex flex-column align-items-center justify-content-center my-4">
                        <Image src={brandIcon} alt="Brand" style={{ height: 58 }} />
                    </div>
                    <div className="p-3 d-flex flex-column align-items-center">
                        <h4 className="text-center mb-4">Merci {userDetails.first_name}, ta réservation est confirmée !</h4>
                        <p style={{ color: "lightgray" }}>Référence du paiment:</p>
                        <p style={{ color: "lightgray" }}>{reservationData.reservation.id_payment_intent}</p>
                        <div className="d-flex flex-column align-items-center justify-content-center mb-4">
                            <Image src={confirmIcon} alt="Confirmation" style={{ height: 120 }} />
                        </div>
                        <p>Tu recevras un mail lorsque ta commande sera prête.</p>
                        <br /> 
                        <p>(Ne pas confondre avec le mail de confirmation de paiment qui vient de t'être envoyé)</p>
                        <br />
                        <Button onClick={() => navigate("/")} className="mt-3" variant="primary">Retour à l'accueil</Button>
                    </div>
                </Container>

                {/* Second bloc - Résumé de commande */}
                <Container className="mb-4" style={{ backgroundColor: "#f8f9fa", border: '1px solid #dee2e6', borderRadius: '8px' }}>
                    <div className="py-3 gap-3 d-flex flex-column justify-content-start">
                        {reservationData.reservationProducts.map((item, index) => (
                            <ProductReservationCard key={`${item.id_product}-${item.id_product_size}-${index}`} item={item} />
                        ))}
                        <div className="d-flex flex-column gap-4 p-2">
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <span>Sous-total {(reservationData.reservationProducts).length} {(reservationData.reservationProducts).length > 1 ? "articles" : "article"}</span>
                                <span>{(typeof subTotal === 'number' ? subTotal.toFixed(2) : '0.00')} €</span>
                            </div>
                            {promoCodeData && (
                                <div className="d-flex justify-content-between align-items-center w-100 text-sucess">
                                    <span className="text-success">{promoCodeData.code}</span>
                                    <span className="text-success">-{(typeof subTotal === 'number' ? (subTotal * promoCodeData.discount_percent / 100).toFixed(2) : '0.00')} €</span>
                                </div>
                            )}
                            <div className="d-flex flex-column w-100">
                                <div className="d-flex justify-content-between align-items-center w-100" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                                    <span>Total</span>
                                    <span>{(typeof total === 'number' ? total.toFixed(2) : '0.00')} €</span>
                                </div>
                                <p style={{ color: "lightgray", fontSize: "0.85rem" }}>Taxes de {(typeof total === 'number' ? (total * 0.2).toFixed(2) : '0.00')} € incluses</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}
 
export default ConfirmationPage;