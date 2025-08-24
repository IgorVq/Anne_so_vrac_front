import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";

const OrderProductCard = ({item}) => {

    const apiUrl = import.meta.env.VITE_URL_API;
    const [unitPrice, setUnitPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);


    function calculatePrice(pricePerKg, weightInGrams, quantity) {
        let total = 0;
        if (item.type === "unit") {
            total = pricePerKg * quantity;
            setUnitPrice(pricePerKg);
        } else {
            const weightInKg = weightInGrams / 1000;
            const unit = pricePerKg * weightInKg;
            setUnitPrice(parseFloat(unit.toFixed(2)));
            total = unit * quantity;
        }
        const finalPrice = parseFloat(total.toFixed(2));
        setTotalPrice(finalPrice);
    }
    

    useEffect(() => {
        calculatePrice(item.price, item.size, item.quantity);
    }, [item.price, item.size, item.quantity]);

    return <>
        <Card
            className="d-flex flex-row justify-content-around rounded col-12 col-md-6 col-lg-4 mb-2"
            style={{ height: "55px", border: "none", backgroundColor:"#FAFAFA" }}
        >
            <div style={{ position: "relative", height: "100%", width: "55px" }}>
                <Card.Img
                    style={{ height: "100%", width: "100%", objectFit: "cover", opacity: "0.85" }}
                    src={apiUrl + item.image_url}
                    alt={item.product_name}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "6px",
                        right: "0",
                        transform: "translate(50%, 50%)", // centre la bulle sur le coin
                        backgroundColor: "rgba(248, 249, 250, 0.95)", // gris clair transparent
                        borderRadius: "50%",
                        padding: "4px 8px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: "#343a40",
                        minWidth: "24px",
                        textAlign: "center",
                        outline: "1px solid rgba(0,0,0,0.1)",
                    }}
                >
                    {item.quantity}
                </div>
            </div>
            <Card.Body className="d-flex flex-column justify-content-between pt-0">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-capitalize mb-0">{item.product_name}</span>
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                    {item.type !== "unit" ? (
                        <span className="text-muted">
                            {item.size >= 1000 ? item.size / 1000 : item.size}{" "}
                            {item.type === "weight"
                                ? item.size >= 1000
                                    ? "kg"
                                    : "g"
                                : item.type === "volume"
                                    ? item.size >= 1000
                                        ? "L"
                                        : "mL"
                                    : ""}
                        </span>
                        ):(<span></span>)}
                    {/* <span style={{ fontSize: "1rem", fontWeight: "bold" }}>{totalPrice.toFixed(2)} €</span> */}
                </div>
            </Card.Body>
        </Card>
    </>;
}
 
export default OrderProductCard;