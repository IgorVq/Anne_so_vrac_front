import { use, useEffect, useState } from "react";
import CartServices from "../../Services/CartServices";
import { Card } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "../../Contexts/CartContext";
import { RxCross1 } from "react-icons/rx";

const ProductCartCard = ({ cartID }) => {
    const [productDetails, setProductDetails] = useState({});
    const apiUrl = import.meta.env.VITE_URL_API;
    const { removeFromCart, updateQuantity } = useCart();

    const fetchProductDetails = async () => {
        if (!cartID) {
            return;
        }
        
        try {
            const response = await CartServices.getCartInfoByCartId(cartID);
            if (response.data) {
                setProductDetails(response.data);
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            // Si l'élément du panier n'existe plus, on peut le retirer de l'affichage
            setProductDetails({});
        }
    };

    const calcProductPrice = () => {
        if (!productDetails.price || !productDetails.type) {
            return 0;
        }
        
        const price = parseFloat(productDetails.price);
        if (isNaN(price)) {
            return 0;
        }
        
        if (productDetails.type === "unit") {
            if (productDetails.discount_percent === undefined || productDetails.discount_percent === null) {
                return price;
            }
            return parseFloat((price * (1 - productDetails.discount_percent / 100)).toFixed(2));
        }
        else {
            const size = parseFloat(productDetails.size);
            if (isNaN(size)) {
                return 0;
            }
            if (productDetails.discount_percent === undefined || productDetails.discount_percent === null) {
                return parseFloat((price * (size / 1000)).toFixed(2));
            }
            return parseFloat((price * (size / 1000) * (1 - productDetails.discount_percent / 100)).toFixed(2));
        }
    };

    useEffect(() => {
        if (cartID) {
            fetchProductDetails();
        }
    }, [cartID]);



    return <>
        {productDetails && productDetails.product_name ? (
        <Card className=" d-flex flex-row justify-content-around rounded" style={{ height: "100px", width: "100%", border: "1px solid #dee2e6" }}>
            <Card.Img
                style={{ height: "100%", width: "100px", aspectRatio: "1 / 1", objectFit: "cover" }}
                src={apiUrl + productDetails.image_url}
                alt={productDetails.product_name}
            />
            <Card.Body className="d-flex flex-column justify-content-between pt-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-capitalize mb-0" style={{ fontWeight: "500" }}>{productDetails.product_name}</span>
                    <RxCross1 onClick={() => removeFromCart(cartID)} style={{ cursor: "pointer", height: "20px", width: "20px", color: "lightgray" }} />
                </div>
                {productDetails.type !== "unit" && (
                    <div className="d-flex flex-column" >
                    <span className="text-muted">{productDetails.size >= 1000  ? productDetails.size/1000 : productDetails.size} {productDetails.type === "weight" ? (productDetails.size >= 1000 ? "kg" : "g") : productDetails.type === "volume" ? (productDetails.size >= 1000 ? "L" : "mL") : ""}</span>


                </div>
                )}
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center justify-content-end">
                    <FaMinus
                        style={{ cursor: "pointer", height: "12px", width: "12px" }}
                        onClick={async () => {
                            if (productDetails.quantity > 1) {
                                await updateQuantity(cartID, productDetails.quantity - 1);
                                fetchProductDetails(); // 🔁 Recharge les infos après la mise à jour
                            }
                        }}
                    />
                    <span className="mx-2">{productDetails.quantity}</span>
                    <FaPlus
                        style={{ cursor: "pointer", height: "12px", width: "12px" }}
                        onClick={async () => {
                            await updateQuantity(cartID, productDetails.quantity + 1);
                            fetchProductDetails(); // 🔁 Recharge les infos après la mise à jour
                        }}
                    />
                </div>
                <div>
                    <span>prix: {calcProductPrice()} €</span>
                </div>
                </div>
            </Card.Body>
        </Card>
        ) : null}
    </>;
}

export default ProductCartCard;