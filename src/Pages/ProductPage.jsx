import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import ProductServices from "../Services/ProductServices";
import DisplayProductImage from "../Components/DisplayProductImage";
import './ProductPage.css';
import DisplayProductSize from "../Components/DisplayProductSize";
import QuantitySelector from "../Components/QuantitySelector";
import ProductInfoDropdown from "../Components/ProductInfoDropdown";
import { useCart } from '../Contexts/CartContext';
import AuthContext from "../Contexts/AuthContext";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";

const ProductPage = () => {
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [productInfo, setProductInfo] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedSizeId, setSelectedSizeId] = useState(null);
    const [selectedType, setSelectedType] = useState("");
    const [unitPrice, setUnitPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const { user, isConnected } = useContext(AuthContext);

    const { addToCart } = useCart();

    const fetchProductDetails = async () => {
        try {
            const response = await ProductServices.getProductsById(productId);
            setProductInfo(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const checkProductDiscount = async () => {
        try {
            const response = await ProductServices.getProductDiscount(productId);
            if (response.data && response.data.discount_percent > 0) {
                const discountPercent = response.data.discount_percent;
                const originalPrice = productInfo.price;
            }
        } catch (error) {
            console.error("Error checking product discount:", error);
        }
    };

    const handleSizeSelect = (size, type, sizeId) => {
        setSelectedSize(size);
        setSelectedType(type);
        setSelectedSizeId(sizeId);
    };

    function calculatePrice(pricePerKg, weightInGrams, quantity) {
        const price = parseFloat(pricePerKg) || 0;
        const weight = parseFloat(weightInGrams) || 0;
        const qty = parseFloat(quantity) || 1;
        
        if (selectedType == "unit") {
            const totalPrice = price * qty;
            setUnitPrice(price);
            setTotalPrice(parseFloat(totalPrice.toFixed(2)));
        } else {
            const weightInKg = weight / 1000;
            const unitPrice = price * weightInKg;
            const totalPrice = unitPrice * qty;
            setUnitPrice(parseFloat(unitPrice.toFixed(2)));
            setTotalPrice(parseFloat(totalPrice.toFixed(2)));
        }
    }

    useEffect(() => {
        if (productInfo && selectedSize) {
            calculatePrice(productInfo.price, selectedSize, quantity);
        }
    }, [productInfo, selectedSize, quantity]);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    return <>
        {productInfo ? (
            <Container className="mt-4">
                {/* Layout Desktop */}
                <div className="d-none d-md-flex justify-content-between">
                    <div className="left-column">
                        <DisplayProductImage productId={productId} />
                        {productInfo && productInfo.cooking_tips && (
                            <div className="cooking-tips mt-3">
                                <h5 className="mb-3">Le conseil d'Anne So'</h5>
                                <FaQuoteLeft />
                                <p className="text-center px-1">{productInfo.cooking_tips}</p>
                                <FaQuoteRight className="align-self-end" />
                            </div>
                        )}
                    </div>
                    <div className="vertical-column-separator" />
                    <div className="right-column">
                        <div className="d-flex flex-column gap-4">
                            <div>
                                <h2 style={{ textTransform: 'capitalize' }}>{productInfo.product_name}</h2>
                                <span>{productInfo.short_description}</span>
                            </div>
                            <p>{productInfo.description}</p>
                            {(productInfo.origin || productInfo.supplier) && (
                                <div style={{ fontSize: "0.9rem", color: "grey" }}>
                                    {productInfo.origin && <p>ORIGINE: {productInfo.origin}</p>}
                                    {productInfo.supplier && <p>Fournisseur: {productInfo.supplier}</p>}
                                </div>
                            )}
                        </div>
                        <div className="my-4 d-flex flex-column align-items-start gap-4">
                            <div className="d-flex flex-column gap-3 w-100">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <div className="d-flex align-items-center">
                                        { productInfo.discount_percent > 0 ? <>
                                            <span style={{ fontSize: "1.8rem", fontWeight: "bold" }}> {parseFloat(unitPrice * (1 - productInfo.discount_percent / 100)).toFixed(2)} €</span>
                                            <span style={{ fontSize: "1.3rem", color: "lightgrey", textDecoration: "line-through", marginLeft: "10px" }}>
                                                {(unitPrice || 0).toFixed(2)} €
                                            </span>
                                        </> : <>
                                            <span style={{ fontSize: "1.8rem", fontWeight: "bold" }}> {(unitPrice || 0).toFixed(2)} €</span>
                                        </>}
                                    </div>
                                    <span style={{ fontSize: "1rem", color: "lightgrey" }}>{selectedType === "" ? parseFloat(productInfo.price).toFixed(2) : null} {selectedType === "weight" ? parseFloat(productInfo.price).toFixed(2) + "€/kg" : selectedType === "volume" ? parseFloat(productInfo.price).toFixed(2) + "€/L" : null}</span>
                                </div>
                                <DisplayProductSize productId={productId} onSizeSelect={handleSizeSelect} />
                                <div className="d-flex justify-content-between align-items-center gap-2 w-100">
                                    {
                                        productInfo?.discount_percent > 0 ? <>
                                            <Button disabled={!isConnected} onClick={() => addToCart({ id_product: productId, quantity, id_product_size: selectedSizeId, id_user: user.id })} className="w-100" style={{ fontSize: "1rem", minHeight: "50px" }}>{<span style={{ fontWeight: "bold", paddingRight: "15px", fontSize: "1.2rem" }}>{parseFloat(totalPrice * (1 - productInfo.discount_percent / 100)).toFixed(2)}€</span>} | <span style={{ paddingLeft: "15px" }}>AJOUTER</span></Button>
                                        </> : <>
                                            <Button disabled={!isConnected} onClick={() => addToCart({ id_product: productId, quantity, id_product_size: selectedSizeId, id_user: user.id })} className="w-100" style={{ fontSize: "1rem", minHeight: "50px" }}>{<span style={{ fontWeight: "bold", paddingRight: "15px", fontSize: "1.2rem" }}>{(totalPrice || 0).toFixed(2)}€</span>} | <span style={{ paddingLeft: "15px" }}>AJOUTER</span></Button>
                                        </>
                                    }
                                    <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                                </div>
                                { !isConnected && (
                                    <div className="mt-3 p-3 rounded d-flex align-items-center" style={{ background: '#fff3cd', border: '1px solid #ffeeba', color: '#856404' }}>
                                        <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>⚠️</span>
                                        <span>Veuillez vous connecter pour ajouter des articles au panier.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-5">
                            <ProductInfoDropdown productInfo={productInfo} />
                        </div>
                    </div>
                </div>

                {/* Layout Mobile */}
                <div className="d-md-none mobile-layout">
                    {/* 1. Photo du produit */}
                    <div className="mobile-section">
                        <DisplayProductImage productId={productId} />
                    </div>

                    {/* 2. Titre */}
                    <div className="mobile-section mobile-title">
                        <h2 style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>{productInfo.product_name}</h2>
                    </div>

                    {/* 3. Courte description */}
                    <div className="mobile-section">
                        <span>{productInfo.short_description}</span>
                    </div>

                    {/* 4. Bloc prix poids quantité ajout au panier */}
                    <div className="mobile-section">
                        <div className="d-flex flex-column gap-3 w-100">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="d-flex align-items-center">
                                    { productInfo.discount_percent > 0 ? <>
                                        <span style={{ fontSize: "1.8rem", fontWeight: "bold" }}> {parseFloat(unitPrice * (1 - productInfo.discount_percent / 100)).toFixed(2)} €</span>
                                        <span style={{ fontSize: "1.3rem", color: "lightgrey", textDecoration: "line-through", marginLeft: "10px" }}>
                                            {(unitPrice || 0).toFixed(2)} €
                                        </span>
                                    </> : <>
                                        <span style={{ fontSize: "1.8rem", fontWeight: "bold" }}> {(unitPrice || 0).toFixed(2)} €</span>
                                    </>}
                                </div>
                                <span style={{ fontSize: "1rem", color: "lightgrey" }}>{selectedType === "" ? parseFloat(productInfo.price).toFixed(2) : null} {selectedType === "weight" ? parseFloat(productInfo.price).toFixed(2) + "€/kg" : selectedType === "volume" ? parseFloat(productInfo.price).toFixed(2) + "€/L" : null}</span>
                            </div>
                            <DisplayProductSize productId={productId} onSizeSelect={handleSizeSelect} />
                            <div className="d-flex justify-content-between align-items-center gap-2 w-100">
                                {
                                    productInfo?.discount_percent > 0 ? <>
                                        <Button onClick={() => addToCart({ id_product: productId, quantity, id_product_size: selectedSizeId, id_user: user.id })} className="w-100" style={{ fontSize: "1rem", minHeight: "50px" }}>{<span style={{ fontWeight: "bold", paddingRight: "15px", fontSize: "1.2rem" }}>{parseFloat(totalPrice * (1 - productInfo.discount_percent / 100)).toFixed(2)}€</span>} | <span style={{ paddingLeft: "15px" }}>AJOUTER</span></Button>
                                    </> : <>
                                        <Button onClick={() => addToCart({ id_product: productId, quantity, id_product_size: selectedSizeId, id_user: user.id })} className="w-100" style={{ fontSize: "1rem", minHeight: "50px" }}>{<span style={{ fontWeight: "bold", paddingRight: "15px", fontSize: "1.2rem" }}>{(totalPrice || 0).toFixed(2)}€</span>} | <span style={{ paddingLeft: "15px" }}>AJOUTER</span></Button>
                                    </>
                                }
                                <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
                            </div>
                        </div>
                    </div>

                    {/* 5. Origine, fournisseur */}
                    {(productInfo.origin || productInfo.supplier) && (
                        <div className="mobile-section" style={{ fontSize: "0.9rem", color: "grey" }}>
                            {productInfo.origin && <p>ORIGINE: {productInfo.origin}</p>}
                            {productInfo.supplier && <p>Fournisseur: {productInfo.supplier}</p>}
                        </div>
                    )}

                    {/* 5.5. Description longue */}
                    <div className="mobile-section">
                        <p>{productInfo.description}</p>
                    </div>

                    {/* 6. Conseil d'Anne So */}
                    {productInfo && productInfo.cooking_tips && (
                        <div className="mobile-section">
                            <div className="cooking-tips">
                                <h5 className="mb-3">Le conseil d'Anne So'</h5>
                                <FaQuoteLeft />
                                <p className="text-center px-1">{productInfo.cooking_tips}</p>
                                <FaQuoteRight className="align-self-end" />
                            </div>
                        </div>
                    )}

                    {/* 7. Composition, additifs, allergènes */}
                    <div className="mobile-section">
                        <ProductInfoDropdown productInfo={productInfo} />
                    </div>
                </div>
            </Container>
        ) : (
            <Container className="mt-4">
                <h2>Chargement des détails du produit...</h2>
            </Container>
        )}
    </>;
}

export default ProductPage;