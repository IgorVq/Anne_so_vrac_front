import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import InfoMagServices from "../../Services/InfoMagServices";

const TopbarMessagesAdminPanel = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [formData, setFormData] = useState({
        message: ''
    });

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const response = await InfoMagServices.getTopbarMessages();
            setMessages(response.data || []);
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
            message: ''
        });
        setEditingMessage(null);
    };

    const openModal = (message = null) => {
        if (message) {
            setEditingMessage(message);
            setFormData({
                message: message.message || ''
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
            if (editingMessage) {
                await InfoMagServices.updateTopbarMessage(editingMessage.id_info_mag, formData);
                toast.success("Message topbar modifié avec succès");
            } else {
                await InfoMagServices.createTopbarMessage(formData);
                toast.success("Message topbar créé avec succès");
            }
            
            closeModal();
            fetchMessages();
        } catch (error) {
            console.error("Error saving topbar message:", error);
            toast.error(`Erreur lors de ${editingMessage ? 'la modification' : 'la création'} du message topbar`);
        }
    };

    const handleDelete = async (messageId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message topbar ?")) {
            try {
                await InfoMagServices.deleteTopbarMessage(messageId);
                toast.success("Message topbar supprimé avec succès");
                fetchMessages();
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

    const sortedMessages = [...messages].sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const getSortIcon = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'asc' ? '↑' : '↓';
        }
        return '↕';
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestion des Messages Topbar</h2>
                <Button variant="primary" onClick={() => openModal()}>
                    <i className="fas fa-plus me-2"></i>
                    Ajouter un message
                </Button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th 
                                scope="col" 
                                onClick={() => handleSort('id_info_mag')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                ID {getSortIcon('id_info_mag')}
                            </th>
                            <th 
                                scope="col" 
                                onClick={() => handleSort('message')}
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                            >
                                Message {getSortIcon('message')}
                            </th>
                            <th scope="col" style={{ width: '150px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMessages.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="text-center text-muted">
                                    Aucun message topbar trouvé
                                </td>
                            </tr>
                        ) : (
                            sortedMessages.map((message) => (
                                <tr key={message.id_info_mag}>
                                    <td>{message.id_info_mag}</td>
                                    <td>
                                        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {message.message}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => openModal(message)}
                                                title="Modifier"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(message.id_info_mag)}
                                                title="Supprimer"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal pour créer/modifier un message */}
            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingMessage ? 'Modifier le message topbar' : 'Ajouter un message topbar'}
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
                                placeholder="Entrez le message à afficher dans la topbar..."
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeModal}>
                            Annuler
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingMessage ? 'Modifier' : 'Créer'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default TopbarMessagesAdminPanel;
