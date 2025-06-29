import React from 'react'
import axios from 'axios';
import user from '../assets/image/user.jpg';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS, axiosInstance } from './APIConfig';

const Profile = () => {
    const handleLogout = async () => {
        try {
            await axiosInstance.post(API_ENDPOINTS.LogOutUser, {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }
    };

    return (
        <div className="!py-1.5 !px-4 flex btn-outline-danger justify-center items-center gap-2 hover:bg-red-500 hover:text-white">
            <button onClick={handleLogout} className="hidden md:!block font-medium text-[15px] w-full">Logout</button>
            <i className="ti ti-door-exit text-xl"></i>
        </div>
    );
}

export default Profile