import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();

    return token ? children : <Navigate to = "/login" />;
};

export default PrivateRoute;