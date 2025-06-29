import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, axiosInstance } from './APIConfig';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

    useEffect(() => {
        axiosInstance.get(API_ENDPOINTS.CheckAuth, {
            withCredentials: true
        })
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;