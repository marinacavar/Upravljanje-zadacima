"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import axios from 'axios';

export default function SignUp() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        // Validacija korisničkog imena
        if (formData.username.trim() === '') {
            newErrors.username = 'Please enter a username';
            valid = false;
        } else {
            newErrors.username = '';
        }

        // Validacija email adrese
        if (!formData.email.trim().includes('@')) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        } else {
            newErrors.email = '';
        }

        // Validacija lozinke
        if (formData.password.trim().length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
            valid = false;
        } else {
            newErrors.password = '';
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            
            axios.post('http://localhost:3001/api/users', formData)
            .then(response => {
                console.log(response.data);
                router.push('/');
            })
            .catch(error => {
                console.error("signup error", error.response.data);
            });

        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen py-2 bg-gray-100">
            <main className="w-full flex flex-col items-center justify-center flex-1 px-5 lg:px-20">
                <div className="bg-white rounded-2xl shadow-2xl w-full lg:w-2/3 max-w-lg">
                    <div className="w-full lg:w-3/5 p-5 mx-auto">
                        <div className="text-left font-bold">
                            <span className="text-blue-800">Company</span>Name
                        </div>
                        <div className="py-10">
                            <h2 className="text-2xl font-bold text-center text-blue-800">Create an Account</h2>
                            <div className="border-2 w-10 border-blue-800 mx-auto mb-2"></div>

                            <div className="flex flex-col items-center">
                                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3">
                                    <AiOutlineUser className="text-gray-400 mr-2"/>
                                    <input type="text" name="username" placeholder="Username" className="bg-gray-100 outline-none flex-1" onChange={handleChange} />
                                </div>
                                {errors.username && <p className="text-red-500">{errors.username}</p>}
                                
                                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3">
                                    <FaRegEnvelope className="text-gray-400 mr-2"/>
                                    <input type="email" name="email" placeholder="Email" className="bg-gray-100 outline-none flex-1" onChange={handleChange} />
                                </div>
                                {errors.email && <p className="text-red-500">{errors.email}</p>}
                                
                                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3">
                                    <MdLockOutline className="text-gray-400 mr-2"/>
                                    <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none flex-1" onChange={handleChange} />
                                </div>
                                {errors.password && <p className="text-red-500">{errors.password}</p>}
                                
                                <button onClick={handleSubmit} className="border-2 border-blue-800 text-blue-800 px-12 py-2 rounded-full inline-block font-semibold hover:bg-blue-800 hover:text-white">Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main> 
        </div>
    );
}
