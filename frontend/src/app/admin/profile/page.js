"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar';
import axios from 'axios';

function Profile() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); 
        if (userId) {
            fetchUserInfo(userId); 
        }
    }, []);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/${userId}`); 
            setUserInfo(response.data); 
        } catch (error) {
            console.error("Error fetching user information", error);
            
        }
    };

    return (
        <div>
            <Sidebar/>
            <div>
                {userInfo && (
                    <div>
                        <h2>Welcome, {userInfo.username}</h2>
                        <p>Email: {userInfo.email}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
