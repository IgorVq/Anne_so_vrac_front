import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../Contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isConnected } = useContext(AuthContext);

    // Vérifier si l'utilisateur est connecté
    if (!isConnected) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
