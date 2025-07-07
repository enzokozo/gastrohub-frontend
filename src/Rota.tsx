import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import Register from './pages/Register';
import Profile from './pages/Profile';

const Rota: React.FC = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
            path="/"
            element={
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
            }
        />
        <Route
            path="/profile"
            element={
                <PrivateRoute>
                    <Profile />
                </PrivateRoute>
            }
        />
    </Routes>
  );
};

export default Rota;