import { Image } from "react-bootstrap";
import facebbokIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";
import gpsIcon from "../assets/gps.png";
import courrierIcon from "../assets/courrier.png";
import mobileIcon from "../assets/mobile.png";
import "./styles/Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className="footer-container">
            <div className="footer-section footer-desc">
                <p>Anne So’Vrac</p><br />
                <p>L’équipe Anne So’Vrac est là pour vous le Mardi, Mercredi, Vendredi & Samedi : 9h–13h / 15h–19h ainsi que le Jeudi : en continu de 13h à 19h</p>
                <p>Besoin de conseils ? Passez nous voir en boutique, on sera ravi·e·s de vous aider !</p>
                <div className="social-icons">
                    <div style={{ cursor: "pointer" }} className="footer-icons">
                        <Image src={facebbokIcon} onClick={() => window.open("http://facebook.com", "_blank")} alt="Facebook" style={{ width: 24 }} />
                    </div>
                    <div style={{ cursor: "pointer" }}  className="footer-icons">
                        <Image src={instagramIcon} onClick={() => window.open("http://instagram.com", "_blank")} alt="Instagram" style={{ width: 24 }} />
                    </div>
                </div>
            </div>

            <div className="footer-section">
                <p>CONTACTEZ-NOUS</p>
                <div className="footer-icons-container">
                    <div className="footer-icons">
                        <Image src={gpsIcon} alt="GPS" style={{ width: 24 }} />
                    </div>
                    <span>7 rue Michelet, 59290 Wasquehal</span>
                </div>
                <div style={{ cursor: "pointer" }} className="footer-icons-container" onClick={() => navigate("/contact")}>
                    <div className="footer-icons">
                        <Image src={courrierIcon} alt="Courrier" style={{ width: 24 }} />
                    </div>
                    <span>contact@annesovrac.fr</span>
                </div>
                <div className="footer-icons-container">
                    <div className="footer-icons">
                        <Image src={mobileIcon} alt="Mobile" style={{ width: 24 }} />
                    </div>
                    <span>09 75 79 96 70</span>
                </div>
            </div>

            <div className="footer-section d-flex flex-column">
                <p>INFOS PRATIQUES</p><br />
                <a onClick={() => navigate("/contact")}>Contactez-nous</a>
                <a onClick={() => navigate("/#map")}>Où nous trouver ?</a>
                <a onClick={() => navigate("/faq")}>Questions Fréquentes</a>
                <a onClick={() => navigate("/legal-notice")}>Mentions Légales</a>
                <a onClick={() => navigate("/privacy-policy")}>Politique de Confidentialité</a>
                <a onClick={() => navigate("/terms-of-sale")}>CGV</a>
                <a onClick={() => navigate("/terms-of-use")}>CGU</a>
            </div>
        </div>
    );
}

export default Footer;
