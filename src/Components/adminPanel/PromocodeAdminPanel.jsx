import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import PromoCodeServices from "../../Services/PromoCodeServices";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import '../styles/AdminPanel.css';

const PromocodeAdminPanel = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPromoCode, setEditingPromoCode] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [formData, setFormData] = useState({
        code: '',
        discount_percent: '',
        valid_from: '',
        valid_to: '',
        is_active: 1
    });

    const fetchPromoCodes = async () => {
        try {
            setLoading(true);
            const response = await PromoCodeServices.getAllPromoCodes();
            setPromoCodes(response.data);
        } catch (error) {
            console.error("Error fetching promo codes:", error);
            toast.error("Erreur lors du chargement des codes promo");
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
            code: '',
            discount_percent: '',
            valid_from: '',
            valid_to: '',
            is_active: 1
        });
        setEditingPromoCode(null);
    };

    const openModal = (promoCode = null) => {
        if (promoCode) {
            setEditingPromoCode(promoCode);
            setFormData({
                code: promoCode.code,
                discount_percent: promoCode.discount_percent,
                valid_from: promoCode.valid_from ? promoCode.valid_from.split('T')[0] : '',
                valid_to: promoCode.valid_to ? promoCode.valid_to.split('T')[0] : '',
                is_active: promoCode.is_active
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
            if (editingPromoCode) {
                await PromoCodeServices.updatePromoCode(editingPromoCode.id_promo_code, formData);
                toast.success("Code promo modifié avec succès");
            } else {
                await PromoCodeServices.createPromoCode(formData);
                toast.success("Code promo créé avec succès");
            }
            closeModal();
            fetchPromoCodes();
        } catch (error) {
            console.error("Error saving promo code:", error);
            toast.error("Erreur lors de la sauvegarde du code promo");
        }
    };

    const handleDelete = async (promoCodeId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) {
            try {
                await PromoCodeServices.deletePromoCode(promoCodeId);
                toast.success("Code promo supprimé avec succès");
                fetchPromoCodes();
            } catch (error) {
                console.error("Error deleting promo code:", error);
                toast.error("Erreur lors de la suppression du code promo");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedPromoCodes = () => {
        if (!sortConfig.key) return promoCodes;

        return [...promoCodes].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'discount_percent' || sortConfig.key === 'id_promo_code') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (sortConfig.key === 'code') {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            } else if (sortConfig.key === 'valid_from' || sortConfig.key === 'valid_to') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
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

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return '';
        }
        return sortConfig.direction === 'asc' ? '▲' : '▼';
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    if (loading) {
        return <div className="loading">Chargement des codes promo...</div>;
    }

    const sortedPromoCodes = getSortedPromoCodes();

    return (
        <div className="promocode-admin-panel">
            <div className="panel-header">
                <h2>Gestion des Codes Promo</h2>
                <Button variant="primary" onClick={() => openModal()}>
                    <FaPlus style={{ marginRight: '8px' }} />
                    Ajouter un Code Promo
                </Button>
            </div>

            <div className="promocodes-table-container">
                <table className="promocodes-table">
                    <thead>
                        <tr>
                            <th 
                                onClick={() => handleSort('id_promo_code')} 
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                ID {getSortIcon('id_promo_code')}
                            </th>
                            <th 
                                onClick={() => handleSort('code')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Code {getSortIcon('code')}
                            </th>
                            <th 
                                onClick={() => handleSort('discount_percent')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Remise (%) {getSortIcon('discount_percent')}
                            </th>
                            <th 
                                onClick={() => handleSort('valid_from')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Valide du {getSortIcon('valid_from')}
                            </th>
                            <th 
                                onClick={() => handleSort('valid_to')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                title="Cliquer pour trier"
                            >
                                Valide au {getSortIcon('valid_to')}
                            </th>
                            <th>Actif</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPromoCodes.map((promoCode) => (
                            <tr key={promoCode.id_promo_code}>
                                <td>{promoCode.id_promo_code}</td>
                                <td className="code-cell">{promoCode.code}</td>
                                <td>{promoCode.discount_percent}%</td>
                                <td>{formatDate(promoCode.valid_from)}</td>
                                <td>{formatDate(promoCode.valid_to)}</td>
                                <td>
                                    <span className={`status ${promoCode.is_active ? 'active' : 'inactive'}`}>
                                        {promoCode.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <Button 
                                        variant="success"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => openModal(promoCode)}
                                        title="Modifier"
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button 
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(promoCode.id_promo_code)}
                                        title="Supprimer"
                                    >
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {promoCodes.length === 0 && (
                    <div className="no-data">Aucun code promo trouvé</div>
                )}
            </div>

            <Modal 
                show={showModal} 
                onHide={closeModal} 
                centered 
                size="lg"
                backdrop="static"
                keyboard={true}
                className="promocode-modal"
                enforceFocus={false}
                restoreFocus={false}
                animation={true}
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>
                        {editingPromoCode ? 'Modifier le code promo' : 'Ajouter un code promo'}
                    </Modal.Title>
                </Modal.Header>
                
                <Form onSubmit={handleSubmit}>
                    <Modal.Body className="border-0">
                        <Form.Group className="mb-3">
                            <Form.Label>Code promo *</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                                placeholder="Ex: SUMMER2025"
                                style={{ fontFamily: 'monospace' }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Pourcentage de remise *</Form.Label>
                            <Form.Control
                                type="number"
                                name="discount_percent"
                                value={formData.discount_percent}
                                onChange={handleInputChange}
                                required
                                min="1"
                                max="100"
                                placeholder="10"
                            />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Valide à partir du *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="valid_from"
                                        value={formData.valid_from}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label>Valide jusqu'au *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="valid_to"
                                        value={formData.valid_to}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active === 1}
                                onChange={handleInputChange}
                                label="Code promo actif"
                            />
                            <small className="text-muted ms-4">
                                Décochez pour désactiver temporairement ce code promo
                            </small>
                        </Form.Group>
                    </Modal.Body>
                    
                    <Modal.Footer className="border-0">
                        <Button variant="secondary" onClick={closeModal}>
                            Annuler
                        </Button>
                        <Button variant={editingPromoCode ? "success" : "primary"} type="submit">
                            {editingPromoCode ? 'Modifier' : 'Créer'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}

export default PromocodeAdminPanel;
