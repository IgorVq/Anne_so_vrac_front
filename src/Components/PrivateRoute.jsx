import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../Contexts/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isConnected } = useContext(AuthContext);

    if (!isConnected) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
