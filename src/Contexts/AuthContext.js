import { createContext } from 'react';

const AuthContext = createContext({
    isConnected: false,
    setIsConnected: () => {},
    role: "",
    setRole: () => {},
    user: {},
    setUser: () => {},
});

export default AuthContext;