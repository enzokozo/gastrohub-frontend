import React from 'react';
import {Routes, Route} from 'react-router-dom'; 
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import PrivateRoute from './routes/PrivateRoute.tsx';

const Rota: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
                path="/" 
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default Rota;
// This component defines the routes of the application, mapping paths to their respective components.