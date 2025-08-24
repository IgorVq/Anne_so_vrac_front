import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge, Table, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ProductServices from '../../Services/ProductServices';
import CategoriesServices from '../../Services/CategoriesServices';
import PromoCodeServices from '../../Services/PromoCodeServices';
import DiscountServices from '../../Services/DiscountServices';
import ImageUploader from '../ImageUploader';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import '../styles/AdminPanel.css';

const API_URL = import.meta.env.VITE_URL_API;

const ProductAdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [promoCodes, setPromoCodes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState('id_product');
    const [sortDirection, setSortDirection] = useState('asc');

    // États pour le formulaire
    const [formData, setFormData] = useState({
        nom: '',
        short_description: '',
        description: '',
        prix: '',
        category_id: '',
        allergen: '',
        composition: '',
        additive: '',
        origin: '',
        cooking_tips: '',
        supplier: '',
        local_product: false,
        visible: true,
        formats: [],
        images: [],
        promotions: [],
        discount_percent: '' // Nouvel état pour le pourcentage de discount
    });

    // États pour les formats
    const [newFormat, setNewFormat] = useState({ nom: '', type: 'unit' });

    // États pour les images
    const [productImages, setProductImages] = useState([]);

    // États pour les promotions
    const [selectedPromos, setSelectedPromos] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Utiliser le nouvel endpoint admin qui retourne tout en une fois
            const [productsRes, categoriesRes, promosRes] = await Promise.all([
                ProductServices.getProductsForAdmin(),
                CategoriesServices.getAllCategories(),
                PromoCodeServices.getAllPromoCodes()
            ]);
            
            // Les produits devraient déjà contenir toutes les informations nécessaires
            let productData = [];
            if (productsRes && productsRes.data) {
                if (productsRes.data.data && Array.isArray(productsRes.data.data)) {
                    // Structure: { data: { data: [...] } }
                    productData = productsRes.data.data;
                } else if (Array.isArray(productsRes.data)) {
                    // Structure: { data: [...] }
                    productData = productsRes.data;
                } else if (productsRes.data.products && Array.isArray(productsRes.data.products)) {
                    // Structure: { data: { products: [...] } }
                    productData = productsRes.data.products;
                }
            }
            
            setProducts(productData);
            setCategories(categoriesRes.data || []);
            setPromoCodes(promosRes.data || []); // Codes promo génériques
        } catch (error) {
            // Fallback : utiliser l'ancienne méthode si le nouvel endpoint n'existe pas encore
            try {
                const [productsRes, categoriesRes, promosRes] = await Promise.all([
                    ProductServices.getAvailableProducts(),
                    CategoriesServices.getAllCategories(),
                    PromoCodeServices.getAllPromoCodes()
                ]);
                
                let productData = [];
                if (productsRes.data) {
                    if (Array.isArray(productsRes.data)) {
                        productData = productsRes.data;
                    } else if (productsRes.data.products && Array.isArray(productsRes.data.products)) {
                        productData = productsRes.data.products;
                    }
                }
                
                // Enrichir avec les catégories
                const categoriesData = categoriesRes.data || [];
                const enrichedProducts = productData.map(product => {
                    const categoryId = product.id_category || product.category_id;
                    const category = categoriesData.find(cat => 
                        cat.id === categoryId || 
                        cat.id_category === categoryId
                    );
                    
                    return {
                        ...product,
                        category: category || null,
                        formats: [], // Seront récupérés via l'endpoint spécialisé
                        images: [],  // Seront récupérés via l'endpoint spécialisé
                        discounts: [] // Seront récupérés via l'endpoint spécialisé
                    };
                });
                
                setProducts(enrichedProducts);
                setCategories(categoriesRes.data || []);
                setPromoCodes(promosRes.data || []);
                
                toast.warning('Endpoint admin/products non disponible, utilisation du fallback');
            } catch (fallbackError) {
                toast.error('Erreur lors du chargement des données');
                setProducts([]); // S'assurer qu'on a au moins un tableau vide
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column) => {
        // Adapter les noms de colonnes aux champs de l'API
        let apiColumn = column;
        if (column === 'nom') apiColumn = 'product_name';
        if (column === 'prix') apiColumn = 'price';
        if (column === 'id') apiColumn = 'id_product';
        
        if (sortColumn === apiColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(apiColumn);
            setSortDirection('asc');
        }
    };

    const sortedProducts = [...products].sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        if (sortColumn === 'category') {
            aVal = a.category?.category_name || a.category?.nom || '';
            bVal = b.category?.category_name || b.category?.nom || '';
        }

        // Gérer les valeurs nulles/undefined
        if (aVal == null) aVal = '';
        if (bVal == null) bVal = '';

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    const getSortIcon = (column) => {
        // Adapter les noms de colonnes aux champs de l'API
        let apiColumn = column;
        if (column === 'nom') apiColumn = 'product_name';
        if (column === 'prix') apiColumn = 'price';
        if (column === 'id') apiColumn = 'id_product';
        
        if (sortColumn !== apiColumn) return '';
        return sortDirection === 'asc' ? ' ▲' : ' ▼';
    };

    const resetForm = () => {
        setFormData({
            nom: '',
            short_description: '',
            description: '',
            prix: '',
            category_id: '',
            allergen: '',
            composition: '',
            additive: '',
            origin: '',
            cooking_tips: '',
            supplier: '',
            local_product: false,
            visible: true,
            formats: [],
            images: [],
            promotions: [],
            discount_percent: ''
        });
        setNewFormat({ nom: '', type: 'unit' });
        setProductImages([]);
        setSelectedPromos([]);
        setEditingProduct(null);
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            
            // Adapter la structure des images pour le modal
            const adaptedImages = product.images ? product.images.map(img => ({
                id: img.id_image,
                url: `${API_URL}${img.image_url}`, // Construire l'URL complète
                ordre: img.order_nb,
                image_url: img.image_url // Garder l'URL originale pour la sauvegarde
            })) : [];
            
            // Adapter et trier les formats par taille décroissante
            const adaptedFormats = (product.formats || []).map(format => ({
                id: format.id_product_size || format.id,
                nom: format.size || format.nom,
                size: format.size || format.nom, // Compatibilité backend
                type: format.type
            })).sort((a, b) => {
                // Trier les formats existants par taille décroissante
                const sizeA = parseFloat(a.nom || a.size) || 0;
                const sizeB = parseFloat(b.nom || b.size) || 0;
                return sizeB - sizeA;
            });
            
            setFormData({
                nom: product.product_name || '',
                short_description: product.short_description || '',
                description: product.description || '',
                prix: product.price || '',
                category_id: product.id_category || '',
                allergen: product.allergen || '',
                composition: product.composition || '',
                additive: product.additive || '',
                origin: product.origin || '',
                cooking_tips: product.cooking_tips || '',
                supplier: product.supplier || '',
                local_product: product.local_product === 1 || product.local_product === true,
                visible: product.visible === 1 || product.visible === true,
                formats: adaptedFormats,
                images: adaptedImages,
                promotions: product.discounts || [],
                discount_percent: product.discounts && product.discounts.length > 0 ? product.discounts[0].discount_percent.toString() : ''
            });
            setProductImages(adaptedImages);
            setSelectedPromos(product.discounts?.map(d => d.id_discount) || []);
            
            // Définir le type par défaut basé sur les formats existants
            if (adaptedFormats && adaptedFormats.length > 0) {
                setNewFormat({ nom: '', type: adaptedFormats[0].type });
            } else {
                setNewFormat({ nom: '', type: 'unit' });
            }
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const addFormat = () => {
        // Vérifications spécifiques selon le type
        if (newFormat.type === 'unit') {
            // Pour le type unit : vérifier qu'il n'y en a pas déjà un
            if (formData.formats.some(f => f.type === 'unit')) {
                toast.warning('Un format "Unité" existe déjà. Vous ne pouvez en avoir qu\'un seul.');
                return;
            }
        } else {
            // Pour les autres types : vérifier que la taille est fournie
            if (!newFormat.nom.trim()) {
                toast.warning('La taille du format est requise');
                return;
            }
        }

        // Vérifier la cohérence des types si il y a déjà des formats
        if (formData.formats.length > 0) {
            const existingType = formData.formats[0].type;
            if (existingType !== newFormat.type) {
                const typeNames = { unit: 'Unité', weight: 'Poids', volume: 'Volume' };
                toast.warning(`Vous ne pouvez ajouter que des formats de type "${typeNames[existingType]}"`);
                return;
            }
        }

        const formatToAdd = {
            id: Date.now(), // Temporaire pour l'affichage
            nom: newFormat.type === 'unit' ? '1' : newFormat.nom,
            size: newFormat.type === 'unit' ? '1' : newFormat.nom, // Compatibilité backend
            type: newFormat.type
        };

        const newFormats = [...formData.formats, formatToAdd].sort((a, b) => {
            // Trier par taille en ordre décroissant après ajout
            const sizeA = parseFloat(a.nom || a.size) || 0;
            const sizeB = parseFloat(b.nom || b.size) || 0;
            return sizeB - sizeA;
        });

        setFormData(prev => ({
            ...prev,
            formats: newFormats
        }));

        // Réinitialiser le formulaire en gardant le même type
        setNewFormat({ 
            nom: '', 
            type: newFormat.type
        });
        
        // Pas de toast ici, seulement lors de la sauvegarde
    };

    const removeFormat = (index) => {
        setFormData(prev => ({
            ...prev,
            formats: prev.formats.filter((_, i) => i !== index)
        }));
        // Pas de toast ici, seulement lors de la sauvegarde
    };

    const handleImageUpload = (imagePath) => {
        // Vérifier la limite de 4 images
        if (productImages.length >= 4) {
            toast.warning('Vous ne pouvez pas ajouter plus de 4 images par produit');
            return;
        }
        
        const newImage = {
            id: Date.now(),
            url: `${API_URL}${imagePath}`, // URL complète pour l'affichage
            image_url: imagePath, // Chemin relatif pour la sauvegarde
            ordre: productImages.length + 1
        };
        
        setProductImages(prev => [...prev, newImage]);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, newImage]
        }));
        
        toast.success('Image ajoutée avec succès');
    };

    const removeImage = (index) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const moveImage = (index, direction) => {
        const newImages = [...productImages];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newImages.length) {
            [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
            
            // Mettre à jour l'ordre local
            newImages.forEach((img, i) => {
                img.ordre = i + 1;
                img.order_nb = i + 1; // Garder aussi order_nb pour la cohérence
            });
            
            setProductImages(newImages);
            setFormData(prev => ({
                ...prev,
                images: newImages
            }));
            
            // Indication visuelle que des changements sont en attente
            toast.info('Ordre modifié - Cliquez sur "Modifier" pour confirmer');
        }
    };

    const handlePromoChange = (promoId) => {
        setSelectedPromos(prev => {
            const newSelected = prev.includes(promoId)
                ? prev.filter(id => id !== promoId)
                : [...prev, promoId];
            
            setFormData(prevForm => ({
                ...prevForm,
                promotions: promoCodes.filter(promo => newSelected.includes(promo.id))
            }));
            
            return newSelected;
        });
    };

    // Fonction pour gérer les discounts
    const handleDiscountChange = async (productId, discountPercent) => {
        try {
            if (!productId) {
                // Si c'est un nouveau produit, on stocke juste la valeur pour l'utiliser après création
                setFormData(prev => ({
                    ...prev,
                    discount_percent: discountPercent
                }));
                return;
            }

            if (discountPercent === '' || discountPercent === '0' || parseInt(discountPercent) === 0) {
                // Supprimer le discount existant
                const existingDiscounts = await DiscountServices.getProductDiscounts(productId);
                if (existingDiscounts.data && existingDiscounts.data.length > 0) {
                    await DiscountServices.deleteDiscount(existingDiscounts.data[0].id_discount);
                    toast.success('Discount supprimé avec succès');
                }
            } else {
                const percent = parseInt(discountPercent);
                if (percent < 1 || percent > 100) {
                    toast.warning('Le pourcentage de discount doit être entre 1 et 100');
                    return;
                }

                // Vérifier s'il y a déjà un discount
                const existingDiscounts = await DiscountServices.getProductDiscounts(productId);
                
                if (existingDiscounts.data && existingDiscounts.data.length > 0) {
                    // Mettre à jour le discount existant
                    await DiscountServices.updateDiscount(existingDiscounts.data[0].id_discount, {
                        discount_percent: percent,
                        id_product: productId
                    });
                    toast.success('Discount mis à jour avec succès');
                } else {
                    // Créer un nouveau discount
                    await DiscountServices.createDiscount({
                        discount_percent: percent,
                        id_product: productId
                    });
                    toast.success('Discount créé avec succès');
                }
            }
            
            // Rafraîchir les données
            fetchData();
        } catch (error) {
            toast.error('Erreur lors de la gestion du discount');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nom.trim() || !formData.prix || !formData.category_id) {
            toast.warning('Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            // Données de base du produit
            const basicProductData = {
                product_name: formData.nom,
                short_description: formData.short_description || '',
                description: formData.description,
                price: parseFloat(formData.prix),
                id_category: parseInt(formData.category_id),
                local_product: formData.local_product ? 1 : 0,
                visible: formData.visible ? 1 : 0,
                allergen: formData.allergen || null,
                composition: formData.composition || null,
                additive: formData.additive || null,
                origin: formData.origin || null,
                cooking_tips: formData.cooking_tips || null,
                supplier: formData.supplier || null
            };

            let response;
            if (editingProduct) {
                // Vérifier s'il y a des changements d'images
                const originalImages = editingProduct.images || [];
                const currentImages = productImages || [];
                
                const hasImageChanges = 
                    originalImages.length !== currentImages.length ||
                    originalImages.some((origImg, index) => {
                        const currentImg = currentImages[index];
                        return !currentImg || 
                               origImg.order_nb !== currentImg.order_nb ||
                               origImg.image_url !== currentImg.image_url;
                    });

                // Vérifier s'il y a des changements de formats (comparaison plus précise)
                const originalFormats = (editingProduct.formats || []).map(f => ({
                    size: f.size || f.nom,
                    type: f.type
                })).sort((a, b) => {
                    const sizeA = parseFloat(a.size) || 0;
                    const sizeB = parseFloat(b.size) || 0;
                    return sizeB - sizeA;
                });
                
                const currentFormats = (formData.formats || []).map(f => ({
                    size: f.size || f.nom,
                    type: f.type
                })).sort((a, b) => {
                    const sizeA = parseFloat(a.size) || 0;
                    const sizeB = parseFloat(b.size) || 0;
                    return sizeB - sizeA;
                });
                
                const hasFormatChanges = 
                    originalFormats.length !== currentFormats.length ||
                    originalFormats.some((origFormat, index) => {
                        const currentFormat = currentFormats[index];
                        return !currentFormat || 
                               origFormat.size !== currentFormat.size ||
                               origFormat.type !== currentFormat.type;
                    });

                if (hasImageChanges || hasFormatChanges) {
                    // Si il y a des changements d'images ou de formats, utiliser l'endpoint admin
                    const updateData = {
                        ...basicProductData
                    };
                    
                    // Ajouter les images seulement si elles ont changé
                    if (hasImageChanges) {
                        updateData.images = currentImages.map((img, index) => ({
                            id_image: img.id || null,
                            image_url: img.image_url || img.url?.replace(`${import.meta.env.VITE_URL_API}`, ''),
                            order_nb: index + 1
                        }));
                    }
                    
                    // Ajouter les formats seulement si ils ont changé
                    if (hasFormatChanges) {
                        updateData.formats = currentFormats.map((format, index) => ({
                            size: format.size,
                            type: format.type,
                            default_selected: index === 0 ? 1 : 0
                        }));
                    }
                    
                    response = await ProductServices.updateProductAdmin(
                        editingProduct.id_product || editingProduct.id, 
                        updateData
                    );
                    toast.success('Produit modifié avec succès');
                    
                    // Gérer le discount après modification
                    const currentDiscountPercent = formData.discount_percent;
                    const originalDiscountPercent = editingProduct.discounts && editingProduct.discounts.length > 0 
                        ? editingProduct.discounts[0].discount_percent.toString() 
                        : '';
                    
                    if (currentDiscountPercent !== originalDiscountPercent) {
                        await handleDiscountChange(editingProduct.id_product || editingProduct.id, currentDiscountPercent);
                    }
                } else {
                    // Pas de changements d'images ni de formats, utiliser l'endpoint classique
                    response = await ProductServices.updateProduct(
                        editingProduct.id_product || editingProduct.id, 
                        basicProductData
                    );
                    toast.success('Produit modifié avec succès');
                    
                    // Gérer le discount après modification
                    const currentDiscountPercent = formData.discount_percent;
                    const originalDiscountPercent = editingProduct.discounts && editingProduct.discounts.length > 0 
                        ? editingProduct.discounts[0].discount_percent.toString() 
                        : '';
                    
                    if (currentDiscountPercent !== originalDiscountPercent) {
                        await handleDiscountChange(editingProduct.id_product || editingProduct.id, currentDiscountPercent);
                    }
                }
            } else {
                // Création : utiliser l'endpoint admin avec toutes les relations
                const productData = {
                    ...basicProductData,
                    // Relations
                    formats: formData.formats.map((format, index) => ({
                        size: format.nom || format.size,
                        type: format.type || 'unit',
                        default_selected: index === 0 ? 1 : 0
                    })),
                    
                    images: productImages.map((img, index) => ({
                        image_url: img.image_url || img.url?.replace(`${import.meta.env.VITE_URL_API}`, ''),
                        order_nb: index + 1
                    })),
                    
                    discounts: [] // Pour l'instant, les discounts seront gérés séparément
                };
                
                response = await ProductServices.createProductAdmin(productData);
                toast.success('Produit créé avec succès');
                
                // Gérer le discount après création du produit
                if (formData.discount_percent && parseInt(formData.discount_percent) > 0) {
                    const productId = response.data.id_product || response.data.product?.id_product;
                    if (productId) {
                        await handleDiscountChange(productId, formData.discount_percent);
                    }
                }
            }

            closeModal();
            fetchData();
        } catch (error) {
            // Fallback vers les anciens endpoints si les admin ne fonctionnent pas
            try {
                const basicProductData = {
                    nom: formData.nom,
                    description: formData.description,
                    prix: parseFloat(formData.prix),
                    category_id: parseInt(formData.category_id)
                };

                if (editingProduct) {
                    await ProductServices.updateProduct(editingProduct.id_product || editingProduct.id, basicProductData);
                    toast.success('Produit modifié avec succès (mode basique)');
                } else {
                    await ProductServices.createProduct(basicProductData);
                    toast.success('Produit créé avec succès (mode basique)');
                }
                
                closeModal();
                fetchData();
            } catch (fallbackError) {
                toast.error('Erreur lors de la sauvegarde du produit');
            }
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit et toutes ses relations ?')) {
            try {
                // Utiliser l'endpoint admin pour la suppression
                await ProductServices.deleteProductAdmin(productId);
                toast.success('Produit supprimé avec succès');
                fetchData();
            } catch (error) {
                // Fallback vers l'ancien endpoint
                try {
                    await ProductServices.deleteProduct(productId);
                    toast.success('Produit supprimé avec succès (mode basique)');
                    fetchData();
                } catch (fallbackError) {
                    toast.error('Erreur lors de la suppression du produit');
                }
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-4">Chargement...</div>;
    }

    return (
        <div className="product-admin-panel">
            <div className="panel-header">
                <h2>Gestion des Produits</h2>
                <Button variant="primary" onClick={() => openModal()}>
                    <FaPlus style={{ marginRight: '8px' }} />
                    Ajouter un Produit
                </Button>
            </div>

            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th 
                                onClick={() => handleSort('id')} 
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                ID{getSortIcon('id')}
                            </th>
                            <th 
                                onClick={() => handleSort('nom')} 
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Nom{getSortIcon('nom')}
                            </th>
                            <th 
                                onClick={() => handleSort('prix')} 
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Prix{getSortIcon('prix')}
                            </th>
                            <th 
                                onClick={() => handleSort('category')} 
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Catégorie{getSortIcon('category')}
                            </th>
                            <th>Formats</th>
                            <th>Images</th>
                            <th>Discounts</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(sortedProducts) && sortedProducts.length > 0 ? (
                            sortedProducts.map((product) => (
                                <tr key={product.id_product}>
                                    <td>{product.id_product}</td>
                                    <td className="product-name-cell">{product.product_name}</td>
                                    <td className="product-price-cell">{product.price}€</td>
                                    <td>{product.category?.category_name || 'Non définie'}</td>
                                <td>
                                    {product.formats?.length > 0 ? (
                                        (() => {
                                            // Déterminer le type principal et compter les formats actifs
                                            const activeFormats = product.formats.filter(f => f.active !== false);
                                            if (activeFormats.length === 0) {
                                                return <Badge bg="secondary">Aucun actif</Badge>;
                                            }
                                            
                                            const mainType = activeFormats[0].type;
                                            const typeNames = { 
                                                unit: 'Unité', 
                                                weight: 'Poids', 
                                                volume: 'Volume' 
                                            };
                                            const typeName = typeNames[mainType] || mainType;
                                            
                                            return (
                                                <Badge bg="info">
                                                    {typeName} ({activeFormats.length})
                                                </Badge>
                                            );
                                        })()
                                    ) : (
                                        <Badge bg="secondary">Aucun</Badge>
                                    )}
                                </td>
                                <td>
                                    {product.images?.length > 0 ? (
                                        <div className="d-flex align-items-center">
                                            {(() => {
                                                // Trouver l'image principale (order_nb = 1)
                                                const mainImage = product.images.find(img => img.order_nb === 1) || product.images[0];
                                                const additionalCount = product.images.length - 1;
                                                
                                                return (
                                                    <div className="d-flex align-items-center">
                                                        <img 
                                                            src={`${API_URL}${mainImage.image_url}`}
                                                            alt="Preview"
                                                            style={{
                                                                width: '40px',
                                                                height: '40px',
                                                                objectFit: 'cover',
                                                                borderRadius: '4px',
                                                                marginRight: '8px'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                        {additionalCount > 0 && (
                                                            <Badge bg="primary">+{additionalCount}</Badge>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <Badge bg="secondary">Aucune</Badge>
                                    )}
                                </td>
                                <td>
                                    {(product.discounts?.length > 0) ? (
                                        <div>
                                            {product.discounts.map((discount, index) => (
                                                <Badge key={index} bg="warning" text="dark" className="me-1 mb-1">
                                                    -{discount.discount_percent}%
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <Badge bg="secondary">Aucun</Badge>
                                    )}
                                </td>
                                <td className="actions-cell">
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => openModal(product)}
                                        title="Modifier"
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(product.id_product)}
                                        title="Supprimer"
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className={loading ? "loading" : "no-data"}>
                                    {loading ? 'Chargement...' : 'Aucun produit trouvé'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal pour ajouter/modifier un produit */}
            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Checkboxes en haut */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="local_product"
                                    label="Produit local"
                                    checked={formData.local_product}
                                    onChange={handleCheckboxChange}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="visible"
                                    label="Produit visible"
                                    checked={formData.visible}
                                    onChange={handleCheckboxChange}
                                />
                            </Col>
                        </Row>

                        {/* Nom et Prix */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nom *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prix de base *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="prix"
                                        value={formData.prix}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Catégorie */}
                        <Form.Group className="mb-3">
                            <Form.Label>Catégorie *</Form.Label>
                            <Form.Select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Sélectionner une catégorie</option>
                                {categories.map(category => (
                                    <option key={category.id || category.id_category} value={category.id || category.id_category}>
                                        {category.category_name || category.nom}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Description courte */}
                        <Form.Group className="mb-3">
                            <Form.Label>Description courte</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="short_description"
                                value={formData.short_description}
                                onChange={handleInputChange}
                                placeholder="Description courte pour l'aperçu..."
                            />
                        </Form.Group>

                        {/* Description complète */}
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        {/* Origine et Fournisseur après catégorie */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Origine</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="origin"
                                        value={formData.origin}
                                        onChange={handleInputChange}
                                        placeholder="ex: France, Italie..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fournisseur</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="supplier"
                                        value={formData.supplier}
                                        onChange={handleInputChange}
                                        placeholder="Nom du fournisseur..."
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Allergènes en pleine largeur */}
                        <Form.Group className="mb-3">
                            <Form.Label>Allergènes</Form.Label>
                            <Form.Control
                                type="text"
                                name="allergen"
                                value={formData.allergen}
                                onChange={handleInputChange}
                                placeholder="ex: Gluten, Lactose, Fruits à coque..."
                            />
                        </Form.Group>

                        {/* Composition en pleine largeur */}
                        <Form.Group className="mb-3">
                            <Form.Label>Composition</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="composition"
                                value={formData.composition}
                                onChange={handleInputChange}
                                placeholder="Liste des ingrédients..."
                            />
                        </Form.Group>

                        {/* Additifs en pleine largeur */}
                        <Form.Group className="mb-3">
                            <Form.Label>Additifs</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="additive"
                                value={formData.additive}
                                onChange={handleInputChange}
                                placeholder="Conservateurs, colorants, émulsifiants..."
                            />
                        </Form.Group>

                        {/* Conseils de cuisson en pleine largeur */}
                        <Form.Group className="mb-3">
                            <Form.Label>Conseils de cuisson</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="cooking_tips"
                                value={formData.cooking_tips}
                                onChange={handleInputChange}
                                placeholder="Temps et température de cuisson, préparation..."
                            />
                        </Form.Group>

                        {/* Section Formats */}
                        <div className="mb-4">
                            <h5>Formats disponibles ({formData.formats.length})</h5>
                            <Row className="mb-2">
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        placeholder={newFormat.type === 'unit' ? "1" : (newFormat.type === 'weight' ? "Poids en g (ex: 500)" : "Volume en mL (ex: 250)")}
                                        value={newFormat.type === 'unit' ? '1' : newFormat.nom}
                                        onChange={(e) => setNewFormat(prev => ({
                                            ...prev,
                                            nom: e.target.value
                                        }))}
                                        disabled={newFormat.type === 'unit'}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Select
                                        value={newFormat.type}
                                        onChange={(e) => {
                                            const newType = e.target.value;
                                            setNewFormat(prev => ({
                                                ...prev,
                                                type: newType,
                                                nom: newType === 'unit' ? '1' : prev.nom
                                            }));
                                        }}
                                        disabled={(() => {
                                            // Si il y a déjà des formats, bloquer le changement de type
                                            if (formData.formats.length > 0) {
                                                return true;
                                            }
                                            return false;
                                        })()}
                                    >
                                        <option value="unit">Unité</option>
                                        <option value="weight">Poids (g)</option>
                                        <option value="volume">Volume (mL)</option>
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={addFormat}
                                        disabled={(() => {
                                            // Si type unit et qu'il y a déjà un format unit, désactiver
                                            if (newFormat.type === 'unit' && 
                                                formData.formats.some(f => f.type === 'unit')) {
                                                return true;
                                            }
                                            return false;
                                        })()}
                                    >
                                        Ajouter Format
                                    </Button>
                                </Col>
                            </Row>
                            
                            {/* Message d'information selon le contexte */}
                            {formData.formats.length > 0 && (
                                <div className="alert alert-info mb-3">
                                    {formData.formats.some(f => f.type === 'unit') 
                                        ? "Type 'Unité' sélectionné - Vous ne pouvez avoir qu'un seul format unité par produit."
                                        : `Type '${formData.formats[0].type === 'weight' ? 'Poids' : 'Volume'}' sélectionné - Vous ne pouvez ajouter que des formats de ce type.`
                                    }
                                </div>
                            )}
                            
                            {newFormat.type === 'unit' && formData.formats.some(f => f.type === 'unit') && (
                                <div className="alert alert-warning mb-3">
                                    Un format 'Unité' existe déjà. Vous ne pouvez pas en ajouter d'autre.
                                </div>
                            )}
                            
                            {formData.formats.length > 0 && (
                                <div className="formats-list">
                                    {formData.formats.map((format, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center p-2 border rounded mb-2">
                                            <span>
                                                {(() => {
                                                    const size = format.nom || format.size;
                                                    const type = format.type;
                                                    if (type === 'unit') {
                                                        return `${size} unité${size > 1 ? 's' : ''}`;
                                                    } else if (type === 'weight') {
                                                        return `${size} g`;
                                                    } else if (type === 'volume') {
                                                        return `${size} mL`;
                                                    }
                                                    return `${size} (${type})`;
                                                })()}
                                                {format.type === 'unit' && ' - Taille fixe'}
                                            </span>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeFormat(index)}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Section Images */}
                        <div className="mb-4">
                            <h5>Images du produit ({productImages.length}/4)</h5>
                            {productImages.length < 4 ? (
                                <ImageUploader onUploadSuccess={handleImageUpload} />
                            ) : (
                                <div className="alert alert-info">
                                    Limite de 4 images atteinte. Supprimez une image pour en ajouter une nouvelle.
                                </div>
                            )}
                            
                            {productImages.length > 0 && (
                                <div className="images-list mt-3">
                                    {productImages.map((image, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center p-2 border rounded mb-2">
                                            <div className="d-flex align-items-center">
                                                <img 
                                                    src={image.url} 
                                                    alt={`Image ${index + 1}`}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                                                />
                                                <span>Position: {index + 1}</span>
                                            </div>
                                            <div>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="me-1"
                                                    onClick={() => moveImage(index, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    ↑
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    className="me-1"
                                                    onClick={() => moveImage(index, 'down')}
                                                    disabled={index === productImages.length - 1}
                                                >
                                                    ↓
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Section Discounts */}
                        <div className="mb-4">
                            <h5>Réduction spécifique au produit</h5>
                            
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Pourcentage de remise (%)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="0"
                                            min="0"
                                            max="100"
                                            name="discount_percent"
                                            value={formData.discount_percent}
                                            onChange={handleInputChange}
                                        />
                                        <Form.Text className="text-muted">
                                            Laissez vide ou mettez 0 pour supprimer la remise
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {editingProduct && (
                        <div className="d-flex align-items-center me-auto">
                            <small className="text-muted">
                                ℹ️ Les modifications sont locales jusqu'au clic sur "Modifier"
                            </small>
                        </div>
                    )}
                    <Button variant="secondary" onClick={closeModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {editingProduct ? 'Modifier' : 'Créer'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductAdminPanel;