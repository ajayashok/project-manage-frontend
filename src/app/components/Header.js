"use client"

import { React,useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Typography
 } from '@mui/material';

const Header = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for token in localStorage only on the client side
        const token = localStorage.getItem('authToken');
        
        if (token) {
            setIsAuthenticated(true); // User is authenticated
        } else {
            setIsAuthenticated(false); // User is not authenticated
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token from local storage
        router.push('/auth/login'); // Redirect to login page
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f5f5f5' }}>
           {isAuthenticated ? ( <button onClick={handleLogout} style={{ padding: '10px', cursor: 'pointer' }}>
                Logout
            </button>
            ) : (
                <Typography variant="h6"></Typography>
            )}
        </header>
    );
};

export default Header;