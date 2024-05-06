"use client"
import React from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
});

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from URL params
  console.log("Token:", token);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const submitForm = async (data) => {
    try {
        const response = await axios.put(`http://localhost:3001/resetPassword?token=${token}`, { newPassword: data.password });

        toast.success(response.data.message,{
            duration: 10000,
        });
        reset();
    } catch (error) {
        toast.error('An error occurred.',{
            duration: 10000,
        });
    }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Toaster />
      <div className="relative">
        <div className="bg-white rounded-lg shadow-lg p-24">
          <div className="absolute top-5 left-5 text-left font-bold">
            <span className="text-blue-800">Task</span>Management
          </div>
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Reset Password</h2>
          <form onSubmit={handleSubmit(submitForm)} autoComplete='off'>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="password">
                New Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="New Password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm Password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
              />
              {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex items-center justify-center mt-10">
              <button className="border-2 rounded-full px-12 py-2 inline-block font-semibold border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
