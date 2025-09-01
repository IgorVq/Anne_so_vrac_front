import { Offcanvas, Button, Form } from 'react-bootstrap';
import { useCart } from '../Contexts/CartContext';
import AuthContext from '../Contexts/AuthContext';
import { useContext, useState, useEffect } from 'react';
import ProductCartCard from './cards/ProductCartCard';
import { useNavigate } from 'react-router-dom';
import CartServices from '../Services/CartServices';


export default function Cart({ show, onHide }) {

  const { cartItems, updateQuantity, removeFromCart, proceedToCheckout } = useCart();
  const { user, isConnected } = useContext(AuthContext);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  const calcTotalPrice = async () => {
    if (cartItems.length === 0) return 0;
    let total = 0;
    
    try {
      const productDetailsPromises = cartItems.map(item => 
        CartServices.getCartInfoByCartId(item.id_cart)
      );
      
      const productDetailsResponses = await Promise.all(productDetailsPromises);
      
      productDetailsResponses.forEach(response => {
        const productDetails = response.data;

        if (productDetails.type === "unit") {
          if (productDetails.discount_percent === undefined || productDetails.discount_percent === null) {
            total += productDetails.price * productDetails.quantity;
          } else {
            total += (productDetails.price * (1 - productDetails.discount_percent / 100)) * productDetails.quantity;
          }
        } else {
          if (productDetails.discount_percent === undefined || productDetails.discount_percent === null) {
            total += productDetails.price * (productDetails.size / 1000) * productDetails.quantity;
          } else {
            total += (productDetails.price * (1 - productDetails.discount_percent / 100)) * (productDetails.size / 1000) * productDetails.quantity;
          }
        }
      });
      
    } catch (error) {
      console.error("Erreur lors du calcul du prix total:", error);
      return 0;
    }
    
    return total;
  };

  useEffect(() => {
    const updateTotalPrice = async () => {
      const total = await calcTotalPrice();
      setTotalPrice(total);
    };
    
    if (isConnected && cartItems.length > 0) {
      updateTotalPrice();
    } else {
      setTotalPrice(0);
    }
  }, [cartItems, isConnected]);


  return (
    <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: '400px' }}>
      <Offcanvas.Header closeButton style={{ borderBottom: '1px solid #dee2e6' }} className='pb-2'>
        <Offcanvas.Title>Votre Panier</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className='gap-2' style={{ display: 'flex', flexDirection: 'column' }}>
        {isConnected ?
          <>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {cartItems.length === 0 && <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: '100%' }}>
                <p className='text-center' style={{ color: "grey" }}>On dirait que vous n'avez encore rien ajouté dans votre panier.</p>
              </div>}
              {cartItems.map(item => (
                <ProductCartCard key={item.id_cart} cartID={item.id_cart} />
              ))}
            </div>
            {cartItems.length > 0 && (
              <div style={{ marginTop: 'auto' }}>
                {totalPrice < 0.50 && (
                  <div className="alert alert-warning small mb-2">
                    <strong>Commande minimum :</strong> 0.50€ requis pour valider votre commande.
                  </div>
                )}
                <Button
                  variant="success"
                  disabled={totalPrice < 0.50}
                  className="w-100"
                  onClick={() => { 
                    onHide();
                    navigate("/reservation");
                  }}
                  style={{ 
                    opacity: totalPrice < 0.50 ? 0.6 : 1
                  }}
                >
                  <div className='d-flex justify-content-center gap-2' style={{ fontSize: '1.4rem' }}>
                    <span>Payer</span>
                    <span>|</span>
                    <span>{totalPrice.toFixed(2)} €</span>
                  </div>
                </Button>
              </div>
            )}
          </>
          : <>
          <div className='d-flex flex-column align-items-center justify-content-center' style={{ height: '100%' }}>
            <p className='text-center' style={{ color: "grey" }}>Il semblerait que vous ne soyez pas connecté.</p>
            <Button variant="primary" onClick={() => {navigate("/login")}}>Se connecter</Button>
          </div>
          </>}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
