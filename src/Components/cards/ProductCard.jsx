import { useEffect, useState } from "react";
import ProductServices from "../../Services/ProductServices";
import { Card, Button } from "react-bootstrap";
import "../styles/ProductCard.css";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ productId }) => {

    const [productDetails, setProductDetails] = useState({});
    const apiUrl = import.meta.env.VITE_URL_API;
    const navigate = useNavigate();

    const fetchProductDetails = async () => {
        try {
            const response = await ProductServices.getProductCardInfo(productId);
            setProductDetails(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    useEffect(() => {
        if (productId)
            fetchProductDetails();
    }, [productId]);

    return (
        <Card onClick={() => navigate("/product/" + productId)} className="product-card position-relative" style={{ borderRadius: "12px", overflow: "hidden", border: "none", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", cursor: "pointer" }}>
            <div className="position-absolute w-100 d-flex justify-content-between align-items-start product-badges" style={{ top: "3px", left: "0", right: "0", zIndex: 2, padding: "0 3px" }}>
                <div className="d-flex flex-column">
                    {productDetails.discount_percent != null && (
                        <span className="badge bg-success mb-1" style={{ fontSize: "10px", fontWeight: "bold" }}>-{productDetails.discount_percent}%</span>
                    )}
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="badge bg-light text-dark mb-1 category-badge" style={{ fontSize: "10px", fontWeight: "500", border: "1px solid #ddd", wordWrap: "break-word", maxWidth: "135px" }}>{productDetails.category_name}</div>
                    {productDetails.local_product == 1 && (
                        <span className="badge" style={{ backgroundColor: "#FFA500", fontSize: "10px", fontWeight: "bold" }}>LOCAL</span>
                    )}
                </div>
            </div>

            <div className="product-content d-flex">
                <Card.Img
                    className="product-image"
                    src={apiUrl + productDetails.image_url}
                    alt={productDetails.product_name}
                />

                <Card.Body className="product-body p-0 mt-2 d-flex flex-column justify-content-between align-items-center">
                    <div className="product-info flex-grow-1">
                        <Card.Title className="product-title text-center mb-1" style={{ fontSize: "16px", fontWeight: "bold", color: "#333", textTransform: "capitalize" }}>
                            {productDetails.product_name || ""}
                        </Card.Title>

                        <Card.Text className="product-description text-center text-muted mb-2" style={{ fontSize: "12px" }}>
                            {productDetails.short_description || ""}
                        </Card.Text>
                    </div>

                    <Button onClick={() => { navigate("/product/" + productId) }} className={`${productDetails.discount_percent ? 'discounted' : ''} price-container d-flex justify-content-around align-items-center w-100 mt-auto`}>
                        <div>

                            {productDetails.discount_percent ? <>
                                <span className="text-white fw-bold" style={{ fontSize: "16px" }}>
                                    {(productDetails.price * (1 - productDetails.discount_percent / 100)).toFixed(2)}
                                    {productDetails.type == "weight" ? "€/kg" : productDetails.type == "volume" ? "€/L" : "€"}
                                </span>
                                <span className="text-white" style={{ fontSize: "14px", textDecoration: "line-through", marginLeft: "5px" }}>
                                    {productDetails.price || "8,75"}
                                    {productDetails.type == "weight" ? "€/kg" : productDetails.type == "volume" ? "€/L" : "€"}
                                </span>
                            </> :
                                <span className="text-white fw-bold" style={{ fontSize: "16px" }}>
                                    {productDetails.price || "8,75"}
                                    {productDetails.type == "weight" ? "€/kg" : productDetails.type == "volume" ? "€/L" : "€"}
                                </span>
                            }
                        </div>
                    </Button>
                </Card.Body>
            </div>
        </Card>
    );
}

export default ProductCard;