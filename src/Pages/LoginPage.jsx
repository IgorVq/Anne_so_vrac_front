import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/AuthContext";
import { toast } from "react-toastify";
import AuthServices from "../Services/AuthServices";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const LoginPage = () => {

    const [currentUser, setCurrentUser] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate()
    const { setIsConnected, setRole, setUser } = useContext(AuthContext)
    const [passwordReset, setPasswordReset] = useState(false)
    const [cguChecked, setCguChecked] = useState(false);
    const [userToCreate, setUserToCreate] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirm: "",
        phone: ""
    })

    const handleLoginChange = (e) => {
        setCurrentUser({ ...currentUser, [e.target.name]: e.target.value })
    }

    const handleRegisterChange = (e) => {
        setUserToCreate({ ...userToCreate, [e.target.name]: e.target.value })
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault()
        const emailRegex = /^(?!.*\.\.)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
        try {
            if (!emailRegex.test(userToCreate.email)) {
                toast.error("Adresse e-mail invalide");
                return;
            }
            if (userToCreate.password !== userToCreate.password_confirm) {
                toast.error("Les mots de passe ne correspondent pas")
                return
            }
            if (userToCreate.password.length < 8) {
                toast.error("Le mot de passe doit contenir au moins 8 caractères")
                return
            }
            if (userToCreate.phone.length !== 10) {
                toast.error("Le numéro de téléphone doit contenir 10 chiffres")
                return
            }
            if (userToCreate.first_name.length < 2 || userToCreate.last_name.length < 2) {
                toast.error("Le prénom et le nom de famille doivent contenir au moins 2 caractères")
                return
            }

            const { password_confirm, ...userToSend } = userToCreate
            const response = await AuthServices.register(userToSend)
            const data = jwtDecode(response.data.token)
            axios.defaults.headers["authorization"] = "Bearer " + response.data.token
            setIsConnected(true)
            setRole(data.admin)
            setUser({
                id: data.id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                admin: data.admin
            })
            localStorage.setItem("authorization", response.data.token)
            toast.success("Inscription réussie")
            navigate("/")
        } catch (error) {
            toast.error(error.response?.data?.message || "Une erreur est survenue")
            console.error(error)
        }
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        if (passwordReset) {
            try {
                const response = await AuthServices.sendEmailToChangePassword(currentUser.email)
                toast.success("Email de réinitialisation envoyé")
                setPasswordReset(false)
            } catch (error) {
                toast.error("Une erreur est survenue, veuillez verifier votre adresse email")
                console.error(error)
            }
        } else {
            try {
                const response = await AuthServices.login(currentUser)
                const data = jwtDecode(response.data.token)
                axios.defaults.headers["authorization"] = "Bearer " + response.data.token
                setIsConnected(true)
                setRole(data.admin)
                setUser({
                    id: data.id,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    admin: data.admin
                })
                toast.success("Vous êtes maintenant connecté")
                navigate("/")
                localStorage.setItem("authorization", response.data.token)
            } catch (error) {
                toast.error("Email ou mot de passe incorrect")
                console.error(error)
            }
        }
    }

    return <>
        <Container>
            <h2 className="text-center mt-4 mb-5">Connexion</h2>
            <div className="d-flex flex-column flex-md-row justify-content-around mb-4">
                <div className="col-md-5">
                    <h3 className="text-center mb-4">Vous avez déjà un compte ?</h3>
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Adresse email</Form.Label>
                            <Form.Control type="email" value={currentUser.email} placeholder="Entrez votre adresse email" name="email" onChange={handleLoginChange} />
                        </Form.Group>
                        {passwordReset ? <>
                            <div className="d-flex justify-content-center">
                                <Button className="center-block" variant="primary" type="submit">
                                    Envoyer le mail de réinitialisation
                                </Button>
                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <Button className="center-block" variant="outline-secondary" onClick={() => setTimeout(() => setPasswordReset(false), 0)} type="button">
                                    Retour à la connexion
                                </Button>
                            </div>
                        </> : <>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Button className="center-block" variant="outline-none" style={{ color: "lightgrey" }} onClick={() => setPasswordReset(true)}>
                                        Mot de passe oublié
                                    </Button>
                                </div>
                                <Form.Control type="password" value={currentUser.password} placeholder="Mot de passe" name="password" onChange={handleLoginChange} />
                            </Form.Group>
                            <div className="d-flex justify-content-center">
                                <Button className="center-block" variant="primary" type="submit">
                                    Connexion
                                </Button>
                            </div>
                            <div className="d-flex justify-content-center mt-3">

                            </div>
                        </>}

                    </Form>
                </div>
                <div className="col-md-5">
                    <h3 className="text-center mb-4">Vous n'avez pas de compte ?</h3>
                    <Form onSubmit={handleRegisterSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicFirst_name">
                            <Form.Label>Prénom</Form.Label>
                            <Form.Control className="text-capitalize" required type="text" value={userToCreate.first_name} placeholder="Jean" name="first_name" onChange={handleRegisterChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicLast_name">
                            <Form.Label>Nom de famille</Form.Label>
                            <Form.Control className="text-capitalize" required type="text" value={userToCreate.last_name} placeholder="Dupond" name="last_name" onChange={handleRegisterChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Adresse email</Form.Label>
                            <Form.Control required type="email" value={userToCreate.email} placeholder="jean.dupond@gmail.com" name="email" onChange={handleRegisterChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Label>Téléphone</Form.Label>
                            <Form.Control required type="tel" value={userToCreate.phone} placeholder="0701020304" name="phone" onChange={handleRegisterChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Mot de passe <span style={{ color: "grey", fontSize: "0.8rem" }}>(min. 8 caractères)</span></Form.Label>
                            <Form.Control required type="password" value={userToCreate.password} placeholder="********" name="password" onChange={handleRegisterChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword2">
                            <Form.Label>Confirmer mot de passe</Form.Label>
                            <Form.Control required type="password" value={userToCreate.password_confirm} placeholder="********" name="password_confirm" onChange={handleRegisterChange} />
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex gap-2 justify-content-center" controlId="formBasicCheckbox">
                            <Form.Check required type="checkbox" onChange={() => setCguChecked(!cguChecked)} />
                            <Form.Label>J'ai lu et j'accepte les <a href="/cgu" target="blank">Condition Générale d'Utilisation</a></Form.Label>
                        </Form.Group>
                        <div className="d-flex justify-content-center">
                            <Button className="center-block" variant="primary" type="submit">
                                Inscription
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    </>;
}

export default LoginPage;