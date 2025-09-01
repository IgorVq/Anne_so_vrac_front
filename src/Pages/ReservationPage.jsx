import { useContext, useEffect, useState, useRef } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";
import UserServices from "../Services/UserServices";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from "../Components/PaymentForm";
import brandIcon from "../assets/brand.png";
import ProductReservationCard from "../Components/cards/ProductReservationCard";
import PromoCodeServices from "../Services/PromoCodeServices";
import { toast } from "react-toastify";
import ReservationServices from "../Services/ReservationServices";
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ReservationPage = () => {
    const { user } = useContext(AuthContext);
    const { clearCart, clearCartLocal } = useCart();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [reservationItems, setReservationItems] = useState([]);
    const [promoCode, setPromoCode] = useState("");
    const [promoCodeState, setPromoCodeState] = useState(0);
    const [promoCodeMessage, setPromoCodeMessage] = useState("");
    const [promoCodeData, setPromoCodeData] = useState(null);
    const reservationInitialized = useRef(false);
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [updatedTotal, setUpdatedTotal] = useState(0);
    const [paymentIntent, setPaymentIntent] = useState(null);
    const [userReservation, setUserReservation] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const initializeReservation = async () => {
        if (reservationInitialized.current) return;
        reservationInitialized.current = true;
        
        try {
            const removePastReservation = await ReservationServices.removeMyPastReservation();
            const newReservation = await ReservationServices.createReservation();
            setPaymentIntent(newReservation.data.paymentIntent);
            setUserReservation(newReservation.data.reservation);
            setSubTotal(newReservation.data.reservation.total_price);
            const reservationProducts = await ReservationServices.getReservationProducts(newReservation.data.reservation.id_reservation);
            setReservationItems(reservationProducts.data);
        } catch (error) {
            console.error("Error checking reservation:", error);
            toast.error("Erreur lors de la vérification de la réservation.");
            reservationInitialized.current = false;
            return null;
        }
    };

    const handleApplyPromoCode = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            const response = await ReservationServices.applyPromoCode(promoCode, userReservation.id_reservation);
            if (response.data.valid) {
                setPaymentIntent(response.data.paymentIntent);
                setPromoCodeData(response.data.promoCode);
                setUpdatedTotal(response.data.updatedTotal);
                setPromoCodeState(1);
                setPromoCodeMessage("Code promo valide !");
            } else {
                setPromoCodeState(2);
                setPromoCodeMessage(response.data.message || "Code promo invalide ou expiré.");
            }
        } catch (error) {
            setPromoCodeState(2);
            setPromoCodeMessage("Erreur lors de la vérification du code promo.");
            console.error("Error applying promo code:", error);
        }
    };    
    
    const handlePaymentSuccess = async (reservationData) => {
        try {
            const response = await ReservationServices.confirmPayment(userReservation.id_reservation, reservationData);
        
            clearCartLocal();
            
            navigate('/confirmation', { 
                state: {
                    reservationData: response.data 
                } 
            });
        } catch (error) {
            console.error("Erreur lors de la confirmation du paiement :", error);
            toast.error("Erreur lors de la confirmation du paiement.");
        }
    }

    useEffect(() => {
        if (user) {
            (async () => {
                const response = await UserServices.getMe();
                setUserDetails(response.data);
            })();
        }
    }, [user]);

    useEffect(() => {
        let cancelled = false;
        
        const initReservation = async () => {
            if (cancelled || reservationInitialized.current) return;
            await initializeReservation();
        };
        
        initReservation();
        
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (promoCodeData) {
            setTotal((subTotal * (1 - promoCodeData.discount_percent / 100)).toFixed(2));
        }
        else {
            setTotal(subTotal);
        }

    }, [promoCodeData, subTotal]);

    const ReservationInfo = () => (
        <div className="p-3">
            <h4 className="text-center mb-4">Information de reservation</h4>
            <p>{userDetails.first_name} {userDetails.last_name}</p>
            <p>{userDetails.email}</p>
            <p>{userDetails.phone}</p>
            <a onClick={() => navigate("/profile")} style={{ color: "lightgrey", fontSize: "0.85rem" }}>Modifier mes informations</a>
        </div>
    );

    const OrderSummary = () => (
        <div className="py-3 gap-3 d-flex flex-column justify-content-start">
            {reservationItems.map((item, index) => (
                <ProductReservationCard key={`${item.id_product}-${item.id_product_size}-${index}`} item={item} />
            ))}
            <div className="d-flex w-100 flex-column pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
                <div className="d-flex w-100 gap-2 justify-content-between">
                    <Form.Control
                        type="text"
                        placeholder="Code promo"
                        style={{ width: "100%" }}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyPromoCode(e);
                            }
                        }}
                    />
                    <Button className="p-2" variant="outline-primary" style={{ height: "38px" }} onClick={handleApplyPromoCode}>OK</Button>
                </div>
                <div className="mx-2">
                    {promoCodeState == 1 ? (
                        <span className="text-success">{promoCodeMessage}</span>
                    ) : (
                        <span className="text-danger">{promoCodeMessage}</span>
                    )}
                </div>
            </div>

            <div className="d-flex flex-column gap-4 p-2">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <span>Sous-total {(reservationItems).length} {(reservationItems).length > 1 ? "articles" : "article"}</span>
                    <span>{subTotal} €</span>
                </div>
                {promoCodeData && (
                    <div className="d-flex justify-content-between align-items-center w-100 text-sucess">
                        <span className="text-success">{promoCodeData.code}</span>
                        <span className="text-success">-{(subTotal * promoCodeData.discount_percent / 100).toFixed(2)} €</span>
                    </div>
                )}
                <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between align-items-center w-100" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        <span>Total</span>
                        <span>{total} €</span>
                    </div>
                    <p style={{ color: "lightgray", fontSize: "0.85rem" }}>Taxes de {(total * 0.2).toFixed(2)} € incluses</p>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {isMobile ? (
                /* Version Mobile */
                <div className="d-flex flex-column flex-grow-1">
                    {/* Logo */}
                    <div className="d-flex flex-column align-items-center justify-content-center my-4">
                        <Image 
                            src={brandIcon} 
                            alt="Brand" 
                            style={{ height: 58, cursor: 'pointer' }} 
                            onClick={() => navigate("/")}
                        />
                    </div>

                    {/* Titre Récapitulatif */}
                    <div className="text-center mb-3">
                        <h4>Récapitulatif</h4>
                    </div>

                    {/* Bloc de droite (résumé de commande) */}
                    <Container className="mb-4" style={{ backgroundColor: "#f8f9fa", border: '1px solid #dee2e6', borderRadius: '8px' }}>
                        <div className="py-3 gap-3 d-flex flex-column justify-content-start">
            {reservationItems.map((item, index) => (
                <ProductReservationCard key={`${item.id_product}-${item.id_product_size}-${index}`} item={item} />
            ))}
            <div className="d-flex w-100 flex-column pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
                <div className="d-flex w-100 gap-2 justify-content-between">
                    <Form.Control
                        type="text"
                        placeholder="Code promo"
                        style={{ width: "100%" }}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyPromoCode(e);
                            }
                        }}
                    />
                    <Button className="p-2" variant="outline-primary" style={{ height: "38px" }} onClick={handleApplyPromoCode}>OK</Button>
                </div>
                <div className="mx-2">
                    {promoCodeState == 1 ? (
                        <span className="text-success">{promoCodeMessage}</span>
                    ) : (
                        <span className="text-danger">{promoCodeMessage}</span>
                    )}
                </div>
            </div>

            <div className="d-flex flex-column gap-4 p-2">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <span>Sous-total {(reservationItems).length} {(reservationItems).length > 1 ? "articles" : "article"}</span>
                    <span>{subTotal} €</span>
                </div>
                {promoCodeData && (
                    <div className="d-flex justify-content-between align-items-center w-100 text-sucess">
                        <span className="text-success">{promoCodeData.code}</span>
                        <span className="text-success">-{(subTotal * promoCodeData.discount_percent / 100).toFixed(2)} €</span>
                    </div>
                )}
                <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between align-items-center w-100" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        <span>Total</span>
                        <span>{total} €</span>
                    </div>
                    <p style={{ color: "lightgray", fontSize: "0.85rem" }}>Taxes de {(total * 0.2).toFixed(2)} € incluses</p>
                </div>
            </div>
        </div>
                    </Container>

                    {/* Informations de réservation */}
                    <Container className="mb-4">
                        <ReservationInfo />
                    </Container>

                    {/* Paiement sécurisé */}
                    <Container className="mb-4">
                        {userReservation ? (
                            <PaymentForm
                                paymentIntent={paymentIntent}
                                reservation={userReservation}
                                updatedTotal={updatedTotal}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        ) : (
                            <p>Aucune réservation trouvée.</p>
                        )}
                    </Container>
                </div>
            ) : (
                /* Version Desktop */
                <div className="d-flex flex-grow-1">
                    <Container className="col-7 flex-grow-1">
                        <div className="d-flex flex-column align-items-center justify-content-center my-4">
                            <Image 
                                src={brandIcon} 
                                alt="Brand" 
                                style={{ height: 58, cursor: 'pointer' }} 
                                onClick={() => navigate("/")}
                            />
                        </div>
                        <ReservationInfo />
                        {/* Paiement sécurisé */}
                        {userReservation ? (
                            <PaymentForm
                                paymentIntent={paymentIntent}
                                reservation={userReservation}
                                updatedTotal={updatedTotal}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                        ) : (
                            <p>Aucune réservation trouvée.</p>
                        )}
                    </Container>
                    <Container style={{ borderLeft: '1px solid #dee2e6', backgroundColor: "#f8f9fa" }} className="col-5 py-3 gap-3 d-flex flex-column justify-content-start flex-grow-1">
                        <div className="py-3 gap-3 d-flex flex-column justify-content-start">
            {reservationItems.map((item, index) => (
                <ProductReservationCard key={`${item.id_product}-${item.id_product_size}-${index}`} item={item} />
            ))}
            <div className="d-flex w-100 flex-column pt-3" style={{ borderTop: "1px solid #dee2e6" }}>
                <div className="d-flex w-100 gap-2 justify-content-between">
                    <Form.Control
                        type="text"
                        placeholder="Code promo"
                        style={{ width: "100%" }}
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleApplyPromoCode(e);
                            }
                        }}
                    />
                    <Button className="p-2" variant="outline-primary" style={{ height: "38px" }} onClick={handleApplyPromoCode}>OK</Button>
                </div>
                <div className="mx-2">
                    {promoCodeState == 1 ? (
                        <span className="text-success">{promoCodeMessage}</span>
                    ) : (
                        <span className="text-danger">{promoCodeMessage}</span>
                    )}
                </div>
            </div>

            <div className="d-flex flex-column gap-4 p-2">
                <div className="d-flex justify-content-between align-items-center w-100">
                    <span>Sous-total {(reservationItems).length} {(reservationItems).length > 1 ? "articles" : "article"}</span>
                    <span>{subTotal} €</span>
                </div>
                {promoCodeData && (
                    <div className="d-flex justify-content-between align-items-center w-100 text-sucess">
                        <span className="text-success">{promoCodeData.code}</span>
                        <span className="text-success">-{(subTotal * promoCodeData.discount_percent / 100).toFixed(2)} €</span>
                    </div>
                )}
                <div className="d-flex flex-column w-100">
                    <div className="d-flex justify-content-between align-items-center w-100" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                        <span>Total</span>
                        <span>{total} €</span>
                    </div>
                    <p style={{ color: "lightgray", fontSize: "0.85rem" }}>Taxes de {(total * 0.2).toFixed(2)} € incluses</p>
                </div>
            </div>
        </div>
                    </Container>
                </div>
            )}
        </>
    );
}

export default ReservationPage;