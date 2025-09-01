import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../Contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { isConnected, role } = useContext(AuthContext);
    console.log('AdminRoute - isConnected:', isConnected, 'role:', role);

    if (!isConnected) {
        return <Navigate to="/login" replace />;
    }

    if (!role || role !== 1) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
