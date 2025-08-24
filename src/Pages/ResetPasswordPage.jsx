import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthServices from "../Services/AuthServices";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (password !== passwordConfirm) {
                toast.error('Les mots de passe ne correspondent pas');
                return;
            }
            if (password.length < 8) {
                toast.error('Le mot de passe doit contenir au moins 8 caractères');
                return;
            }
            await AuthServices.resetPassword(token, { password });
            toast.success('Mot de passe modifié avec succès');
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error('Erreur lors de la modification du mot de passe');
        }
    }

    return <Container className="d-flex flex-column align-items-center ">
        <h1 className="mb-4 text-center">Reinitialisation du mot de passe</h1>
        <Form onSubmit={handleSubmit} className="w-50">
            <Form.Group controlId="password">
                <Form.Label>Nouveau mot de passe</Form.Label>
                <Form.Control type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Form.Group className="mt-3" controlId="passwordConfirm">
                <Form.Label>Confirmer nouveau mot de passe</Form.Label>
                <Form.Control type="password" placeholder="********" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            </Form.Group>
            <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" className=" mt-3">
                    Confirmer
                </Button>
            </div>
        </Form>

    </Container>;
}

export default ResetPasswordPage;