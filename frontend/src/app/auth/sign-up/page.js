"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
    username: yup.string()
        .required('Please enter a username'),
    email: yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
});

const SignUp = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, dirtyFields, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    useEffect(() => {
        console.log('isValid', isValid);
    }, [isValid]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const submitForm = async (data) => {
        console.log(data);
        try {
            const response = await axios.post('http://localhost:3001/api/users', data);
            console.log(response.data);
            router.push('/');
            alert('Uspješno ste se registrirali!');
        } catch (error) {
            console.error("signup error", error.response.data);
            if (error.response.status === 400 && error.response.data.message === "User with this email already exists") {
                setErrorMessage('User with this email already exists!');
            } else if (error.response.status === 400 && error.response.data.message === "User with this username already exists") {
                setErrorMessage('User with this username already exists!');
            } else {
                setErrorMessage('Error occurred while registering. Please try again later.');
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen py-2 bg-gray-100">
            <main className="w-full flex flex-col items-center justify-center flex-1 px-5 lg:px-20">
                <div className="bg-white rounded-2xl shadow-2xl w-full lg:w-2/3 max-w-lg">
                    <div className="w-full lg:w-3/5 p-5 mx-auto">
                        <div className="text-left font-bold">
                            <span className="text-blue-800">Task</span>Management
                        </div>
                        <div className="py-10">
                            <h2 className="text-2xl font-bold text-center text-blue-800">Create an Account</h2>
                            <div className="border-2 w-10 border-blue-800 mx-auto mb-2"></div>

                            <form onSubmit={handleSubmit(submitForm)} className="flex flex-col items-center">
                                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3">
                                    {AiOutlineUser && <AiOutlineUser className="text-gray-400 mr-2" />}
                                    <input type="text" name="username" placeholder="Username" className="bg-gray-100 w-full lg:w-64" {...register("username")} />
                                </div>
                                <p className='error-message'>{dirtyFields.username && errors.username?.message}</p>

                                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3">
                                    <FaRegEnvelope className="text-gray-400 mr-2" />
                                    <input type="email" name="email" placeholder="Email" className="bg-gray-100 w-full lg:w-64" {...register("email")} />
                                </div>
                                <p className="error-message">{dirtyFields.email && errors.email?.message}</p>

                                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3 relative">
                                    <div className="text-gray-400 mr-2">
                                        <MdLockOutline />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        className="bg-gray-100 w-full lg:w-64 "
                                        {...register("password")}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        {showPassword ? (
                                            <MdVisibility
                                                className="text-gray-400 cursor-pointer"
                                                onClick={togglePasswordVisibility}
                                            />
                                        ) : (
                                            <MdVisibilityOff
                                                className="text-gray-400 cursor-pointer"
                                                onClick={togglePasswordVisibility}
                                            />
                                        )}
                                    </div>
                                </div>
                                <p className='error-message'>{dirtyFields.password && errors.password?.message}</p>

                                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3 relative">
                                    <div className="text-gray-400 mr-2">
                                        <MdLockOutline />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        className="bg-gray-100 w-full lg:w-64 "
                                        {...register("confirmPassword")}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        {showConfirmPassword ? (
                                            <MdVisibility
                                                className="text-gray-400 cursor-pointer"
                                                onClick={toggleConfirmPasswordVisibility}
                                            />
                                        ) : (
                                            <MdVisibilityOff
                                                className="text-gray-400 cursor-pointer"
                                                onClick={toggleConfirmPasswordVisibility}
                                            />
                                        )}
                                    </div>
                                </div>
                                <p className='error-message'>{dirtyFields.confirmPassword && errors.confirmPassword?.message}</p>

                                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                                <button type="submit" className="border-2 border-blue-800 text-blue-800 px-12 py-2 rounded-full inline-block font-semibold hover:bg-blue-800 hover:text-white">Sign Up</button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SignUp;
