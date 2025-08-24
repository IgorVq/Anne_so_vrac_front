// src/context/CartContext.js

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
      // Vérifier s'il existe déjà un article avec le même id_product et id_product_size
      const existingItem = cartItems.find(item => 
        item.id_product == product.id_product && 
        item.id_product_size == product.id_product_size
      );

      if (existingItem) {
        // Si l'article existe déjà, mettre à jour la quantité
        const newQuantity = existingItem.quantity + (product.quantity || 1);
        await updateQuantity(existingItem.id_cart, newQuantity);
      } else {
        // Si l'article n'existe pas, l'ajouter au panier
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
      // Vérifier que l'utilisateur est bien disponible
      if (!user || !user.id) {
        console.warn('Utilisateur non disponible pour vider le panier');
        setCartItems([]); // Vider le state local quand même
        return;
      }
      
      await CartServices.clearCart(user.id);
      // Vider immédiatement le state local
      setCartItems([]);
      // Pas besoin de fetchCart() car on vient de vider le panier
      // et on a déjà mis à jour le state local
    } catch (err) {
      console.error('Erreur lors de la suppression du panier :', err);
      // En cas d'erreur, on recharge quand même pour être sûr
      if (user && user.id) {
        await fetchCart();
      }
      throw err; // Relancer l'erreur pour que l'appelant puisse la gérer
    }
  };

  // Fonction pour vider seulement le state local (sans appel API)
  const clearCartLocal = () => {
    setCartItems([]);
  };
  
  useEffect(() => {
    if (!isConnected) {
      // Vider le panier en local quand l'utilisateur se déconnecte
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
