import { Button, Container } from "react-bootstrap";
import AuthServices from "../Services/AuthServices";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Profile from "../Components/Profile";
import OrderHistory from "../Components/OrderHistory";
import ContactDetails from "../Components/ContactDeails";
import AuthContext from "../Contexts/AuthContext";
import { useCart } from "../Contexts/CartContext";

const ProfilePage = () => {
    const navigate = useNavigate();
    const [blockToDisplay, setBlockToDisplay] = useState("account");
    const { setIsConnected, isConnected, setRole, setUser } = useContext(AuthContext);
    const { setCartItems } = useCart();

    const handleLogout = () => {
        AuthServices.logout();
        setIsConnected(false);
        setRole(null);
        setUser(null);
        setCartItems([]);
        navigate("/login");
    };



    const resetPassword = () => {
        AuthServices.sendEmailToChangePassword(AuthServices.getUser().email);
        toast.success("Un email de réinitialisation de mot de passe a été envoyé à votre adresse email.");
    };

    useEffect(() => {
        if (!AuthServices.isConnected()) {
            navigate("/login");
        }
    }, []);

    return <>
        { isConnected && <>
            {/* Version Desktop */}
            <div className="d-none d-lg-flex flex-grow-1 w-100" style={{ minHeight: 0 }}>
                <div style={{borderRight: "1px solid #E6E6E6"}} className="d-flex flex-column gap-3 col-3 flex-grow-1 p-3">
                    <h2>Bonjour {AuthServices.getUser().first_name} !</h2>
                    <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("account")} variant={ blockToDisplay == "account" ? "primary" : "outline-primary"}>Mon Compte</Button>
                    <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("orderHistory")} variant={ blockToDisplay == "orderHistory" ? "primary" : "outline-primary"}>Historique des commandes</Button>
                    <Button style={{textAlign: "left"}} onClick={() => setBlockToDisplay("contactDetails")} variant={ blockToDisplay == "contactDetails" ? "primary" : "outline-primary"}>Mes coordonnées</Button>
                    <div className="d-flex flex-column gap-1 mt-2">
                        <span onClick={resetPassword} style={{cursor: "pointer"}}>Réinitialiser le mot de passe</span>
                        <span className="red" style={{cursor: "pointer"}} onClick={handleLogout}>Se Déconnecter</span>
                    </div>
                </div>
                <div className="col-9 flex-grow-1 p-3">
                    {blockToDisplay === "account" ? (
                        <Profile />
                    ) : blockToDisplay === "orderHistory" ? (
                        <OrderHistory />
                    ) : (
                        <ContactDetails />
                    )}
                </div>
            </div>

            {/* Version Mobile */}
            <div className="d-flex d-lg-none flex-column flex-grow-1 w-100">
                <Container className="py-3">
                    <h2 className="mb-3">Bonjour {AuthServices.getUser().first_name} !</h2>
                    
                    {/* Select pour la navigation mobile */}
                    <select 
                        className="form-select mb-3"
                        value={blockToDisplay}
                        onChange={(e) => setBlockToDisplay(e.target.value)}
                    >
                        <option value="account">Mon Compte</option>
                        <option value="orderHistory">Historique des commandes</option>
                        <option value="contactDetails">Mes coordonnées</option>
                    </select>

                    {/* Boutons déconnexion/reset - uniquement si "Mon Compte" est sélectionné */}
                    {blockToDisplay === "account" && (
                        <div className="d-flex flex-column gap-2 mb-4">
                            <Button 
                                variant="outline-secondary" 
                                onClick={resetPassword}
                                className="w-100"
                            >
                                Réinitialiser le mot de passe
                            </Button>
                            <Button 
                                variant="outline-danger" 
                                onClick={handleLogout}
                                className="w-100"
                            >
                                Se Déconnecter
                            </Button>
                        </div>
                    )}
                </Container>
                
                {/* Contenu principal mobile */}
                <Container className="flex-grow-1 pb-4">
                    {blockToDisplay === "account" ? (
                        <Profile />
                    ) : blockToDisplay === "orderHistory" ? (
                        <OrderHistory />
                    ) : (
                        <ContactDetails />
                    )}
                </Container>
            </div>
        </>}
    </>;
}

export default ProfilePage;