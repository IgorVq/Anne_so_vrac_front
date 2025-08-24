import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../Contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { isConnected, role } = useContext(AuthContext);
    console.log('AdminRoute - isConnected:', isConnected, 'role:', role);

    // Vérifier si l'utilisateur est connecté
    if (!isConnected) {
        return <Navigate to="/login" replace />;
    }

    // Vérifier si l'utilisateur a le rôle admin
    // Dans votre système, le rôle admin est un booléen
    if (!role || role !== 1) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
