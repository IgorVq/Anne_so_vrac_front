import Slider from "react-slick";
import "./styles/InfoBox.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const infoData = [
  {
    icon: "🌱",
    title: "Local & Responsable",
    desc: "Des produits 100 % locaux, en direct des producteurs de la région. Soutenez l’agriculture de proximité tout en réduisant votre empreinte carbone.",
  },
  {
    icon: "♻️",
    title: "Zéro Déchet, Zéro Superflu",
    desc: "Ici, pas d'emballages inutiles. Venez avec vos contenants ou utilisez ceux disponibles en boutique : simple, économique, écologique.",
  },
  {
    icon: "🧡",
    title: "Du Bon, Du Vrai, Du Juste",
    desc: "Des produits de qualité, au juste prix, pour vous et pour les producteurs. Une consommation éthique et savoureuse, sans compromis.",
  },
];

const InfoBox = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 7000, 
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <div className="info-box-wrapper d-none d-md-flex justify-content-between mt-5">
        {infoData.map((item, index) => (
          <div key={index} className="info-box">
            <div><span>{item.icon}</span></div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="d-md-none mt-5">
        <Slider {...settings}>
          {infoData.map((item, index) => (
            <div key={index}>
              <div className="info-box mx-auto">
                <div><span>{item.icon}</span></div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default InfoBox;
