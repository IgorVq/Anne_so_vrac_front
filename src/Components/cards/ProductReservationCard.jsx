import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const ProductReservationCard = ({ item }) => {
    const apiUrl = import.meta.env.VITE_URL_API;
    const [totalPrice, setTotalPrice] = useState(0);

    function calculatePrice(pricePerKg, weightInGrams, quantity, discount_percent) {
        let total = 0;
        if (item.type === "unit") {
            if (discount_percent !== undefined && discount_percent !== null) {
                total = (pricePerKg * (1 - discount_percent / 100)) * quantity;
            } else {
                total = pricePerKg * quantity;
            }
        } else {
            const weightInKg = weightInGrams / 1000;
            const unit = pricePerKg * weightInKg;
            if (discount_percent !== undefined && discount_percent !== null) {
                total = (unit * (1 - discount_percent / 100)) * quantity;
            } else {
                total = unit * quantity;
            }
        }
        const finalPrice = parseFloat(total.toFixed(2));
        setTotalPrice(finalPrice);
    }
    

    useEffect(() => {
        calculatePrice(item.price, item.size, item.quantity, item.discount_percent);
    }, [item.price, item.size, item.quantity, item.discount_percent]);

    return (
        <Card
            className="d-flex flex-row justify-content-around rounded"
            style={{ height: "90px", width: "100%", border: "none", backgroundColor:"#FAFAFA" }}
        >
            <div style={{ position: "relative", height: "100%", width: "90px" }}>
                <Card.Img
                    style={{ height: "100%", width: "100%", objectFit: "cover" }}
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
            <Card.Body className="d-flex flex-column justify-content-between pt-1">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-capitalize mb-0">{item.product_name}</span>
                </div>
                <div>
                    {item.type !== "unit" && (
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
                    )}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        {item.type !== "unit" && (
                            <span style={{ fontSize: "0.9rem", color: "lightgrey" }}>
                                {item.type === "weight"
                                    ? item.price + "€/kg"
                                    : item.type === "volume"
                                        ? item.price + "€/L"
                                        : ""}
                            </span>
                        )}
                    </div>
                    <span style={{ fontSize: "1rem", fontWeight: "bold" }}>{totalPrice.toFixed(2)} €</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProductReservationCard;
