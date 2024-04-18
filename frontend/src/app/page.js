"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaRegEnvelope } from 'react-icons/fa';
import { MdLockOutline, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
});

const Home = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, dirtyFields, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  useEffect(() => {
    console.log('isValid', isValid);
  }, [isValid]);

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const submitForm = async (data) => {
    try {
        const response = await axios.post('http://localhost:3001/login', data);
        console.log(response.data); 

        const { id, role, username, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', id); 

        

        if (role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/home');
        }
    } catch (error) {
        console.error("login error", error); 
        if (error.response && error.response.data) {
            setErrorMessage(error.response.data.message);
        } else {
            setErrorMessage("An error occurred while logging in");
        }
    }
};


  const goToSignUp = () => {
    router.push('/auth/sign-up');
  };

  return (
    <div className="flex flex-col justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-5 lg:px-20 min-h-screen bg-gray-100 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row w-full lg:w-2/3 max-w-4xl">
          <div className="w-full lg:w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-blue-800">Company</span>Name
            </div>
            <div className="py-24">
              <h2 className="text-3xl font-bold text-blue-800">Sign in to Account</h2>
              <div className="border-2 w-10 border-blue-800 inline-block mb-2"></div>

              <form onSubmit={handleSubmit(submitForm)} className="flex flex-col items-center" autoComplete='off'>
                <div className={`bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3`}>
                  <FaRegEnvelope className="text-gray-400 mr-2"/>
                  <input type="email" name="email" placeholder="Email" className="bg-gray-100 w-full lg:w-64 " {...register("email")} />
                </div>
                {dirtyFields.email && <p className='error-message'>{errors.email?.message}</p>} 

                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3 relative" >
                  <div className="text-gray-400 mr-2">
                  <MdLockOutline />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    className="bg-gray-100 w-full lg:w-64 flex-1 "
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
                        onClick={togglePasswordVisibility}/>
                    )}
                  </div>
                </div>
                {dirtyFields.password && <p className='error-message'>{errors.password?.message}</p>} 

                <div className="flex justify-between w-full lg:w-64 mb-5 ">
                  <label className="flex items-center text-xs">
                    <input type="checkbox" name="remember" className="mr-1"/>
                    Remember me
                  </label>
                  <a href="#" className="text-xs">Forgot Password?</a>
                </div>
                {errorMessage && <p className='error-message'>{errorMessage}</p>} 
                <button className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-white" >Sign In </button>
              </form>
            </div>
          </div>

          <div className="w-full lg:w-2/5 bg-blue-800 text-white rounded-tr-2xl rounded-br-2xl py-10 lg:py-36 px-6 lg:px-12">
            <h2 className="text-3xl font-bold mb-2">Welcome to Task Management</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-2">Sign up to start managing your tasks</p>
            <p className="mb-2 invisible">mmm</p>
            <button className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-800" onClick={goToSignUp}>Sign Up</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
