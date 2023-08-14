import React from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';


function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get('http://localhost:3001/logout')
            .then(response => {
                navigate('/');
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

export default LogoutButton;
