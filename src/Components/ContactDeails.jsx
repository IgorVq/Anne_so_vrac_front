import { use, useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import AuthContext from "../Contexts/AuthContext";
import UserServices from "../Services/UserServices";

const ContactDetails = () => {
    const { user } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);

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

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await UserServices.updateUserDetails(userDetails);
            setUserDetails(response.data);
            setShowEditForm(false);
            fetchUserDetails(); // Refresh user details after update
        } catch (error) {
            console.error("Error updating user details:", error);
        }
    };
    
    useEffect(() => {
        fetchUserDetails();
    }, [user]);

    return (
        <>
            {!showEditForm && <>
                <div className="d-flex gap-3 mt-3 justify-content-around">
                    <div className="d-flex flex-column gap-2">
                        <span><strong>Prénom:</strong> {userDetails.first_name || "N/A"}</span>
                        <span><strong>Nom:</strong> {userDetails.last_name || "N/A"}</span>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <span><strong>Email:</strong> {userDetails.email || "N/A"}</span>
                        <span><strong>Téléphone:</strong> {userDetails.phone || "N/A"}</span>
                    </div>
                </div>
                <div className="d-flex justify-content-center gap-2 mt-5">
                    <Button onClick={() => setShowEditForm(true)} style={{ width: "300px" }} variant="primary">
                        {showEditForm ? "Annuler" : "Modifier mes informations"}
                    </Button>
                </div></>}
            {showEditForm && (
                <Container className="">
                    <h3 className="mb-3">Modifier vos coordonnées</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formFirstName">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez votre prénom"
                                value={userDetails.first_name || ""}
                                onChange={handleChange}
                                name="first_name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mt-3">
                            <Form.Label>Nom</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Entrez votre nom"
                                value={userDetails.last_name || ""}
                                onChange={handleChange}
                                name="last_name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Entrez votre email"
                                value={userDetails.email || ""}
                                onChange={handleChange}
                                name="email"
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhone" className="mt-3">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Entrez votre numéro de téléphone"
                                value={userDetails.phone || ""}
                                onChange={handleChange}
                                name="phone"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Enregistrer les modifications
                        </Button>

                    </Form>
                    {/* Formulaire de modification des informations de contact */}
                    {/* Vous pouvez ajouter ici les champs nécessaires pour modifier les informations */}
                </Container>
            )}
        </>
    );
}

export default ContactDetails;
