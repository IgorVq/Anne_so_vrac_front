import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import HomeSlider from "../Components/HomeSlider";
import InfoBox from "../Components/InfoBox";
import { useEffect } from "react";

const HomePage = () => {
    const location = useLocation();

    useEffect(() => {
        const hash = location.hash;
        if (hash === "#map") {
            const el = document.getElementById("map-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return <>
        <HomeSlider />
        <Container className="mt-3">
            <InfoBox />
            <div className="mt-5">
                <h2 className="text-center mb-4">ACCÈS À LA BOUTIQUE</h2>
                <iframe style={{ borderRadius: "20px" }} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2528.7173830946185!2d3.127545677678848!3d50.66950767163489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3298446753567%3A0x7af70352e117d1a!2zw4lwaWNlcmllIFZyYWMgfCBBbm5lIFNv4oCZIFZyYWM!5e0!3m2!1sfr!2sfr!4v1750253389415!5m2!1sfr!2sfr" width="100%" height="450" allowFullScreen="" loading="lazy"></iframe>
                <div id="map-section"></div>
            </div>
        </Container>
    </>;
}

export default HomePage;