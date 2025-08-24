import { useEffect, useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import InfoMagServices from "../../Services/InfoMagServices";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import '../styles/AdminPanel.css';

const InfoMagAdminPanel = () => {
    const [infoMags, setInfoMags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingInfoMag, setEditingInfoMag] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [formData, setFormData] = useState({
        message: '',
        display: 'topbar'
    });

    const fetchInfoMags = async () => {
        try {
            setLoading(true);
            const response = await InfoMagServices.getTopbarMessages();
            setInfoMags(response.data || []);
        } catch (error) {
            console.error("Error fetching topbar messages:", error);
            toast.error("Erreur lors du chargement des messages topbar");
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            message: '',
            display: 'topbar'
        });
        setEditingInfoMag(null);
    };

    const openModal = (infoMag = null) => {
        if (infoMag) {
            setEditingInfoMag(infoMag);
            setFormData({
                message: infoMag.message || '',
                display: infoMag.display || 'topbar'
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
        
        if (!formData.message.trim()) {
            toast.error("Le message est obligatoire");
            return;
        }

        try {
            if (editingInfoMag) {
                await InfoMagServices.updateTopbarMessage(editingInfoMag.id_info_mag, formData);
                toast.success("Message topbar modifié avec succès");
            } else {
                await InfoMagServices.createTopbarMessage(formData);
                toast.success("Message topbar créé avec succès");
            }
            closeModal();
            fetchInfoMags();
        } catch (error) {
            console.error("Error saving topbar message:", error);
            toast.error(`Erreur lors de ${editingInfoMag ? 'la modification' : 'la création'} du message topbar`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message topbar ?")) {
            try {
                await InfoMagServices.deleteTopbarMessage(id);
                toast.success("Message topbar supprimé avec succès");
                fetchInfoMags();
            } catch (error) {
                console.error("Error deleting topbar message:", error);
                toast.error("Erreur lors de la suppression du message topbar");
            }
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedInfoMags = [...infoMags].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key] || '';
            const bValue = b[sortConfig.key] || '';
            
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
        }
        return '';
    };

    useEffect(() => {
        fetchInfoMags();
    }, []);

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="infomag-admin-panel">
            <div className="panel-header">
                <h2>Gestion des Messages Topbar</h2>
                <Button variant="primary" onClick={() => openModal()}>
                    <FaPlus style={{ marginRight: '8px' }} />
                    Ajouter un Message
                </Button>
            </div>

            <div className="infomag-table-container">
                <table className="infomag-table">
                    <thead>
                        <tr>
                            <th 
                                style={{ cursor: 'pointer', userSelect: 'none' }} 
                                onClick={() => handleSort('id_info_mag')}
                                title="Cliquer pour trier"
                            >
                                ID{getSortIcon('id_info_mag')}
                            </th>
                            <th 
                                style={{ cursor: 'pointer', userSelect: 'none' }} 
                                onClick={() => handleSort('message')}
                                title="Cliquer pour trier"
                            >
                                Message{getSortIcon('message')}
                            </th>
                            <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedInfoMags.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="no-data">
                                    Aucun message topbar trouvé
                                </td>
                            </tr>
                        ) : (
                            sortedInfoMags.map(infoMag => (
                                <tr key={infoMag.id_info_mag}>
                                    <td>{infoMag.id_info_mag}</td>
                                    <td className="message-cell">
                                        {infoMag.message ? 
                                            (infoMag.message.length > 100 ? 
                                                infoMag.message.substring(0, 100) + '...' : 
                                                infoMag.message
                                            ) : 
                                            '-'
                                        }
                                    </td>
                                    <td className="actions-cell">
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => openModal(infoMag)}
                                                title="Modifier"
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(infoMag.id_info_mag)}
                                                title="Supprimer"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal d'ajout/modification */}
            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingInfoMag ? 'Modifier le message' : 'Ajouter un nouveau message'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Message *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Entrez le message..."
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Annuler
                        </Button>
                        <Button type="submit" variant="primary">
                            {editingInfoMag ? 'Modifier' : 'Créer'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default InfoMagAdminPanel;
