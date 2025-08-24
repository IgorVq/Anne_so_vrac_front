import { Navbar, Nav, Container, Image, Form, InputGroup } from "react-bootstrap";
import brandIcon from "../assets/brand.png";
import searchIcon from "../assets/search.png";
import userIcon from "../assets/user.png";
import userConnectedIcon from "../assets/user_connected.png";
import settingsIcon from "../assets/setting.png";
import cartIcon from "../assets/cart.png";
import todoIcon from "../assets/checklist.png";
import "./styles/NavBar.css";
import { useContext, useEffect, useState, useRef } from "react";
import AuthContext from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from '../Contexts/CartContext';
import ProductServices from '../Services/ProductServices';


const NavBar = ({ onCartClick }) => {
  const { isConnected, setIsConnected, user, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [totalItems, setTotalItems] = useState(0);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const searchIconRef = useRef(null);
  const menuRef = useRef(null);
  const menuCloseTimeoutRef = useRef(null);

  // Calcul du nombre total d'articles dans le panier
  useEffect(() => {
    if (isConnected && cartItems && cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setTotalItems(total);
    } else {
      setTotalItems(0);
    }
  }, [cartItems, isConnected]);

  // Fonction pour basculer l'affichage de la barre de recherche
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar) {
      setSearchQuery('');
    }
  };

  // Fonction pour gérer l'appui sur la touche Entrée
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchBar(false);
      setSearchQuery('');
    }
  };

  // Gestion des clics en dehors de la barre de recherche
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          searchIconRef.current && !searchIconRef.current.contains(event.target)) {
        setShowSearchBar(false);
        setSearchQuery('');
      }
    };

    if (showSearchBar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchBar]);

  // Gestion de la fermeture du menu burger
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Délai de 200ms avant fermeture
        menuCloseTimeoutRef.current = setTimeout(() => {
          setIsMenuOpen(false);
        }, 200);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (menuCloseTimeoutRef.current) {
        clearTimeout(menuCloseTimeoutRef.current);
      }
    };
  }, [isMenuOpen]);

  // Fonction pour fermer le menu et naviguer
  const navigateAndCloseMenu = (path) => {
    // Délai de 150ms avant fermeture lors d'un clic sur un lien
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 150);
    navigate(path);
  };

  // Fonction pour basculer l'état du menu burger
  const toggleMenu = () => {
    // Annuler le timeout de fermeture si on clique sur le burger
    if (menuCloseTimeoutRef.current) {
      clearTimeout(menuCloseTimeoutRef.current);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return <>
    <div className="navbar-wrapper">
      <Navbar expand="lg" className="py-2 px-3" sticky="top" style={{ minHeight: "80px" }} expanded={isMenuOpen}>
      <Container className="position-relative align-items-center" style={{ display: "flex", justifyContent: "center" }}>

        {/* Burger menu à gauche en mobile */}
        <div className="d-lg-none burger-fixed" ref={menuRef}>
          <Navbar.Toggle aria-controls="navbar-content" onClick={toggleMenu} />
        </div>

        {/* Logo à gauche en desktop */}
        <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/")} className="position-absolute start-0 d-none d-lg-block">
          <Image src={brandIcon} alt="Brand" style={{ height: 58 }} />
        </Navbar.Brand>

        {/* Logo centré en mobile */}
        <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/")} className="mx-auto d-lg-none">
          <Image src={brandIcon} alt="Brand" style={{ height: 58 }} />
        </Navbar.Brand>

        {/* Menu déroulant centré */}
        <Navbar.Collapse id="navbar-content" className="justify-content-center mt-3 mt-lg-0">
          <Nav className="gap-4">
            <Nav.Link onClick={() => navigateAndCloseMenu("/products/all")}>NOS PRODUITS</Nav.Link>
            <Nav.Link onClick={() => navigateAndCloseMenu("/products/promo")}>PROMOTIONS</Nav.Link>
            <Nav.Link onClick={() => navigateAndCloseMenu("/products/local")}>PRODUITS LOCAUX</Nav.Link>
            <Nav.Link onClick={() => navigateAndCloseMenu("/our-values")}>NOS VALEURS</Nav.Link>
            {/* Liens admin visibles seulement dans le menu burger mobile */}
            { isConnected && role === 1 && <>
              <Nav.Link onClick={() => { navigateAndCloseMenu("/admin-panel") }} className="d-lg-none">
                🛠️ ADMIN PANEL
              </Nav.Link>
              <Nav.Link onClick={() => { navigateAndCloseMenu("/todo") }} className="d-lg-none">
                📋 TODO LIST
              </Nav.Link>
            </> }
          </Nav>
        </Navbar.Collapse>

        {/* Icônes toujours visibles à droite */}
        <div className="d-flex align-items-center gap-3 icons-fixed">
          <Nav.Link onClick={toggleSearchBar} style={{ cursor: 'pointer' }} ref={searchIconRef}>
            <Image src={searchIcon} alt="Search" style={{ width: 24 }} />
          </Nav.Link>
          {/* Icônes admin visibles seulement sur desktop */}
          { isConnected && role === 1 && <>
              <Nav.Link onClick={() => { navigateAndCloseMenu("/admin-panel") }} className="d-none d-lg-block">
                <Image src={settingsIcon} alt="Admin User" style={{ width: 24 }} />
              </Nav.Link>
            <Nav.Link onClick={() => { navigateAndCloseMenu("/todo") }} className="d-none d-lg-block">
              <Image src={todoIcon} alt="Todo List" style={{ width: 24 }} />
            </Nav.Link>
            </> }
          {isConnected ? (
            <Nav.Link onClick={() => { navigateAndCloseMenu("/profile") }}>
              <Image src={userConnectedIcon} alt="Connected User" style={{ width: 24 }} />
            </Nav.Link>
          ) : (
            <Nav.Link onClick={() => { navigateAndCloseMenu("/login") }}>
              <Image src={userIcon} alt="User" style={{ width: 24 }} />
            </Nav.Link>
          )}
          <Nav.Link onClick={onCartClick} className="position-relative">
            <Image src={cartIcon} alt="Cart" style={{ width: 24 }} />
            {totalItems > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.7rem' }}
              >
                {totalItems}
              </span>
            )}
          </Nav.Link>
        </div>
      </Container>
      </Navbar>
      
      {/* Barre de recherche comme extension de la navbar */}
      {showSearchBar && (
        <div className="search-extension-bar" ref={searchRef}>
          <Container>
            <div className="search-container">
              <InputGroup className="search-input-group">
                <Form.Control
                  type="text"
                  placeholder="Rechercher un produit... (Appuyez sur Entrée pour rechercher)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  className="search-input"
                  autoFocus
                />
                <InputGroup.Text className="search-close" onClick={toggleSearchBar}>
                  ✕
                </InputGroup.Text>
              </InputGroup>
            </div>
          </Container>
        </div>
      )}
    </div>
  </>;
};

export default NavBar;
