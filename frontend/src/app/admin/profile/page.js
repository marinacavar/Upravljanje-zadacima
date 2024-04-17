"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = ({ userId }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/users/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{user.username}'s Profile</h1>
            <p>Email: {user.email}</p>
            {/* Display other user details here */}
        </div>
    );
};

export default ProfilePage;