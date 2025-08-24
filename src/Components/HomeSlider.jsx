import { Button, Image } from "react-bootstrap";
import localProductsImage from "../assets/local_products.jpg";
import "./styles/HomeSlider.css";
import { useNavigate } from "react-router-dom";

const HomeSlider = () => {
  const navigate = useNavigate();
  return (
    <div className="slider-container d-flex flex-column flex-md-row align-items-stretch mt-3">
      <div className="left-panel">
        <span>PRODUITS LOCAUX</span>
        <h2>Soutenez le local, savourez l'authentique</h2>
        <span>Le goût de chez nous</span>
        <Button onClick={() => navigate('/products/local')} className="mt-3" variant="primary">Découvrir</Button>
      </div>

      {/* Séparateur entre les deux panels */}
      <div className="vertical-separator d-none d-md-block" />

      <div className="right-panel">
        <Image
          src={localProductsImage}
          alt="Produits Locaux"
          style={{
            height: "100%",
            width: "100%",
            minHeight: "200px",
            objectFit: "cover",
            display: "block"
          }}
          fluid
        />
      </div>
    </div>
  );
};

export default HomeSlider;
