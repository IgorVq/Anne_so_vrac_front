import { createContext, useContext, useState, useEffect } from 'react';
import AuthContext from "../Contexts/AuthContext";
import CartServices from '../Services/CartServices';
import Cart from '../Components/Cart';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isConnected } = useContext(AuthContext);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await CartServices.getMyCart();
      setCartItems(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement du panier :', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    try {
      const existingItem = cartItems.find(item => 
        item.id_product == product.id_product && 
        item.id_product_size == product.id_product_size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + (product.quantity || 1);
        await updateQuantity(existingItem.id_cart, newQuantity);
      } else {
        await CartServices.addToCart(product);
        await fetchCart();
      }
      toast.info("Produit ajouté au panier !");
    } catch (err) {
      console.error("Erreur lors de l'ajout au panier :", err);
    }
  };


  const updateQuantity = async (cartId, newQuantity) => {
    try {
      await CartServices.updateCartQuantity(cartId, newQuantity);
      await fetchCart();
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la quantité :', err);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      await CartServices.removeFromCart(cartId);
      await fetchCart();
    } catch (err) {
      console.error('Erreur lors de la suppression du produit :', err);
    }
  }; 

  const clearCart = async () => {
    try {
      if (!user || !user.id) {
        console.warn('Utilisateur non disponible pour vider le panier');
        setCartItems([]);
        return;
      }
      
      await CartServices.clearCart(user.id);
      setCartItems([]);
    } catch (err) {
      console.error('Erreur lors de la suppression du panier :', err);
      if (user && user.id) {
        await fetchCart();
      }
      throw err;
    }
  };

  const clearCartLocal = () => {
    setCartItems([]);
  };
  
  useEffect(() => {
    if (!isConnected) {
      setCartItems([]);
      return;
    }
    fetchCart();
  }, [isConnected]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        clearCartLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
