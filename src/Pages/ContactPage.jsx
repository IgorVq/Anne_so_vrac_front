import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UsersServices from "../Services/UserServices";
import { toast } from "react-toastify";

const ContactPage = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [cguChecked, setCguChecked] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
            if (!emailRegex.test(formData.email) || formData.email.length > 60) {
                toast.error("L'email doit être valide.");
                return;
            }
            if (formData.message.length < 10 || formData.message.length > 500) {
                toast.error("Le message doit contenir entre 10 et 500 caractères.");
                return;
            }
            if (formData.name.length < 3 || formData.name.length > 50) {
                toast.error("Le nom doit contenir entre 3 et 50 caractères.");
                return;
            }
            const response = await UsersServices.sendContactEmail(formData);
            setSubmitted(true);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };
    return <>
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4">Contactez-nous</h2>
            {submitted ? (
                <div>
                    <div className="alert alert-success mb-4">Merci pour votre message ! Vous allez reçevoir une réponse sous peu.</div>
                    <div className="d-flex flex-column align-items-center">
                        <Button onClick={() => navigate("/")}>Retourner à l'acceuil</Button>
                    </div>
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nom <span style={{ color: "#ED1C24" }}>*</span></Form.Label>
                        <Form.Control
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email <span style={{ color: "#ED1C24" }}>*</span></Form.Label>
                        <Form.Control
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Message <span style={{ color: "#ED1C24" }}>*</span></Form.Label>
                        <Form.Control
                            required
                            as="textarea"
                            name="message"
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex gap-2 justify-content-center" controlId="formBasicCheckbox">
                        <Form.Check required type="checkbox" onChange={() => setCguChecked(!cguChecked)} />
                        <Form.Label>J'ai lu et j'accepte les <a href="/cgu" target="blank">Condition Générale d'Utilisation</a> <span style={{ color: "#ED1C24" }}>*</span></Form.Label>
                    </Form.Group>
                    <div className="d-flex justify-content-center">
                        <Button type="submit">Envoyer</Button>
                    </div>
                </Form>
            )}
        </div>
        {/* <div style={{ maxWidth: "800px", margin: "0 auto" }} className="mt-5">
            <h2 className="mt-5 text-center">Où nous trouver ?</h2>
            <div className="mt-4 d-flex flex-column align-items-center justify-content-center" style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "8px", overflow: "hidden" }}>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5061.019101277158!2d3.142772089679253!3d50.63622719847386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2d7d4d66bc095%3A0xddd0df4e3dd5356f!2sParc%20du%20H%C3%A9ron!5e0!3m2!1sfr!2sfr!4v1746271988231!5m2!1sfr!2sfr"
                    width="100%"
                    height="400px"
                    aria-hidden="false"
                ></iframe>
            </div>
        </div> */}
    </>;
}

export default ContactPage;