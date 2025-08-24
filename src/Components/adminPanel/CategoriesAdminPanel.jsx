import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import CategoriesServices from "../../Services/CategoriesServices";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import '../styles/AdminPanel.css';

const CategoriesAdminPanel = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [formData, setFormData] = useState({
        category_name: '',
        description: '',
        visible: 1
    });

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await CategoriesServices.getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Erreur lors du chargement des catégories");
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const resetForm = () => {
        setFormData({
            category_name: '',
            description: '',
            visible: 1
        });
        setEditingCategory(null);
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                category_name: category.category_name,
                description: category.description || '',
                visible: category.visible
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await CategoriesServices.updateCategory(editingCategory.id_category, formData);
                toast.success("Catégorie modifiée avec succès");
            } else {
                await CategoriesServices.createCategory(formData);
                toast.success("Catégorie créée avec succès");
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("Erreur lors de la sauvegarde de la catégorie");
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
            try {
                await CategoriesServices.deleteCategory(categoryId);
                toast.success("Catégorie supprimée avec succès");
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("Erreur lors de la suppression de la catégorie");
            }
        }
    };

    // Fonction pour gérer le tri
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Fonction pour trier les données
    const getSortedCategories = () => {
        if (!sortConfig.key) return categories;

        return [...categories].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Gestion spéciale pour les différents types de données
            if (sortConfig.key === 'id_category') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (sortConfig.key === 'category_name' || sortConfig.key === 'description') {
                aValue = String(aValue || '').toLowerCase();
                bValue = String(bValue || '').toLowerCase();
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Fonction pour obtenir l'icône de tri
    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return ''; // Pas d'icône si la colonne n'est pas triée
        }
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (loading) {
        return <div className="loading">Chargement des catégories...</div>;
    }

    const sortedCategories = getSortedCategories();

    return (
        <div className="categories-admin-panel">
            <div className="panel-header">
                <h2>Gestion des Catégories</h2>
                <Button variant="primary" onClick={() => openModal()}>
                    <FaPlus style={{ marginRight: '8px' }} />
                    Ajouter une Catégorie
                </Button>
            </div>

            <div className="categories-table-container">
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th 
                                onClick={() => handleSort('id_category')} 
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                ID {getSortIcon('id_category')}
                            </th>
                            <th 
                                onClick={() => handleSort('category_name')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Nom {getSortIcon('category_name')}
                            </th>
                            <th 
                                onClick={() => handleSort('description')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Description {getSortIcon('description')}
                            </th>
                            <th>Visible</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCategories.map((category) => (
                            <tr key={category.id_category}>
                                <td>{category.id_category}</td>
                                <td className="name-cell">{category.category_name}</td>
                                <td className="description-cell">
                                    {category.description ? 
                                        (category.description.length > 100 ? 
                                            category.description.substring(0, 100) + '...' : 
                                            category.description
                                        ) : 
                                        <em>Aucune description</em>
                                    }
                                </td>
                                <td>
                                    <span className={`status ${category.visible ? 'visible' : 'hidden'}`}>
                                        {category.visible ? 'Visible' : 'Masquée'}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <Button 
                                        variant="success"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => openModal(category)}
                                        title="Modifier"
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button 
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(category.id_category)}
                                        title="Supprimer"
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {categories.length === 0 && (
                    <div className="no-data">Aucune catégorie trouvée</div>
                )}
            </div>

            {/* Modal Bootstrap pour ajouter/modifier */}
            <Modal 
                show={showModal} 
                onHide={closeModal} 
                centered 
                size="lg"
                backdrop="static"
                keyboard={true}
                className="categories-modal"
                enforceFocus={false}
                restoreFocus={false}
                animation={true}
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>
                        {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                    </Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="border-0">
                        <Form.Group className="mb-3">
                            <Form.Label>Nom de la catégorie *</Form.Label>
                            <Form.Control
                                type="text"
                                name="category_name"
                                value={formData.category_name}
                                onChange={handleInputChange}
                                required
                                placeholder="Ex: Épicerie fine"
                                maxLength={150}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Description de la catégorie (optionnel)"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="visible"
                                name="visible"
                                checked={formData.visible === 1}
                                onChange={handleInputChange}
                                label="Catégorie visible"
                            />
                            <small className="text-muted ms-4">
                                Décochez pour masquer temporairement cette catégorie
                            </small>
                        </Form.Group>
                    </Modal.Body>
                    
                    <Modal.Footer className="border-0">
                        <Button variant="secondary" onClick={closeModal}>
                            Annuler
                        </Button>
                        <Button variant={editingCategory ? "success" : "primary"} type="submit">
                            {editingCategory ? 'Modifier' : 'Créer'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default CategoriesAdminPanel;
