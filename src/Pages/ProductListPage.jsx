import { use, useEffect, useState } from "react";
import ProductServices from "../Services/ProductServices";
import ProductCard from "../Components/cards/ProductCard";
import "./ProductListPage.css";
import { Button, Container } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CategoriesServices from "../Services/CategoriesServices";

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceSort, setPriceSort] = useState("");
    const [showSearchTitle, setShowSearchTitle] = useState(false);
    const {offerType} = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            let response;
            if (searchQuery) {
                response = await ProductServices.getAvailableProducts();
            } else if (offerType == "promo") {
                response = await ProductServices.getAvailablePromoProducts();
            } else if (offerType == "local") {
                response = await ProductServices.getAvailableLocalProducts();
            } else if (offerType == "all") {
                response = await ProductServices.getAvailableProducts();
            }
            if (response && response.data) {
                setProducts(response.data);
                if (searchQuery) {
                    const searchResults = response.data.filter(product => {
                        const normalizeString = (str) => {
                            return str.toLowerCase()
                                     .normalize('NFD')
                                     .replace(/[\u0300-\u036f]/g, '');
                        };
                        
                        const productName = normalizeString(product.product_name);
                        const query = normalizeString(searchQuery);
                        const matches = productName.includes(query);
                        return matches;
                    });
                    setFilteredProducts(searchResults);
                } else {
                    setFilteredProducts(response.data);
                }
            } else {
                console.error("No products found in the response.");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const fetchCategory = async () => {
        try {
            const response = await CategoriesServices.getAvailableCategories();
            if (response && response.data) {
                setCategories(response.data);
            } else {
                console.error("No categories found in the response.");
            }

        } catch (error) {
            console.error("Error fetching category:", error);
            
        }
    }

    const calculateFinalPrice = (product) => {
        if (product.discount_percent && product.discount_percent > 0) {
            return product.price * (1 - product.discount_percent / 100);
        }
        return product.price;
    }

    const sortProducts = (productsToSort, sortOrder) => {
        if (!sortOrder || sortOrder === "none") return productsToSort;
        
        const sortedProducts = [...productsToSort].sort((a, b) => {
            if (sortOrder === "price_asc") {
                const priceA = calculateFinalPrice(a);
                const priceB = calculateFinalPrice(b);
                return priceA - priceB;
            } else if (sortOrder === "price_desc") {
                const priceA = calculateFinalPrice(a);
                const priceB = calculateFinalPrice(b);
                return priceB - priceA;
            } else if (sortOrder === "name_asc") {
                return a.product_name.localeCompare(b.product_name);
            } else if (sortOrder === "name_desc") {
                return b.product_name.localeCompare(a.product_name);
            }
            return 0;
        });
        
        return sortedProducts;
    }

    const filterProductsByCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId === "" || categoryId === "all") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => product.id_category == categoryId);
            setFilteredProducts(filtered);
        }
    }

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        filterProductsByCategory(categoryId);
    }

    const handlePriceSortChange = (e) => {
        const sortOrder = e.target.value;
        setPriceSort(sortOrder);
        
        if (sortOrder === "none") {
            if (selectedCategory === "" || selectedCategory === "all") {
                setFilteredProducts(products);
            } else {
                const filtered = products.filter(product => product.id_category == selectedCategory);
                setFilteredProducts(filtered);
            }
        } else {
            const sortedProducts = sortProducts(filteredProducts, sortOrder);
            setFilteredProducts(sortedProducts);
        }
    }

    useEffect(() => {
        if (!searchQuery) {
            if (selectedCategory === "") {
                setFilteredProducts(products);
            } else {
                filterProductsByCategory(selectedCategory);
            }
        }
    }, [products, searchQuery]);

    useEffect(() => {
        fetchProducts();
        fetchCategory();
        if (searchQuery) {
            const timer = setTimeout(() => {
                setShowSearchTitle(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setShowSearchTitle(false);
        }
    }, [offerType, searchQuery]);

    useEffect(() => {
        const handleClick = () => {
            if (searchQuery && showSearchTitle) {
                setShowSearchTitle(false);
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [searchQuery, showSearchTitle]);

    return <>
        {searchQuery && showSearchTitle && (
            <Container fluid className="py-3">
                <h2 className="text-center">Résultats de recherche pour "{searchQuery}"</h2>
            </Container>
        )}
        
        <div className="category-filter-bar">
            <div className="filter-container">
                <select 
                    id="category-select"
                    className="category-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="" disabled>Choisir une catégorie</option>
                    <option value="all">Toutes les catégories</option>
                    {categories.map(category => (
                        <option 
                            key={category.id_category}
                            value={category.id_category}
                        >
                            {category.category_name}
                        </option>
                    ))}
                </select>
                
                <select 
                    id="price-sort-select"
                    className="category-select"
                    value={priceSort}
                    onChange={handlePriceSortChange}
                >
                    <option value="" disabled>Trier par</option>
                    <option value="none">Aucun tri</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                    <option value="name_asc">Nom A-Z</option>
                    <option value="name_desc">Nom Z-A</option>
                </select>
            </div>
        </div>
        
        {/* Titres conditionnels pour les offres spéciales - après les filtres */}
        {!searchQuery && offerType === "promo" && (
            <Container fluid className="py-3">
                <h2 className="text-center">Produits en promotions</h2>
            </Container>
        )}
        
        {!searchQuery && offerType === "local" && (
            <Container fluid className="py-3">
                <h2 className="text-center">Produits locaux</h2>
            </Container>
        )}
        
        <Container fluid>
            {/* Filtre par catégorie avec select */}

            {filteredProducts.length > 0 ? (
            <div className="product-list">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id_product} productId={product.id_product} />
                ))}
            </div>
        ) : (
            <div className="text-center p-5">
                <p className="text-muted">Aucun produit disponible pour cette catégorie.</p>
                <Button variant="primary mt-4" onClick={() => {navigate("/products/all")}}>Voir tous les produits</Button>
            </div>
        )}
        </Container>
    </>;
}
 
export default ProductListPage;