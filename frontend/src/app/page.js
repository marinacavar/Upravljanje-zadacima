'use client';
// import Navbar from "./components/navbar";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from 'react-icons/md';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import axios from 'axios';


export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // Definišemo stanje email adrese
  const [password, setPassword] = useState(''); // Definišemo stanje lozinke


  const goToSignIn = () => {
    
    // Proveravamo da li su sva polja forme popunjena
    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password."); 
      return; 
    }
    axios.post (' http://localhost:3001/login ', { email, password })
      .then(response => {
      console.log(response.data);
      // Preusmjeravanje na nadzornu ploču ili početnu stranicu nakon uspješne prijave
      router.push('/auth/sign-in');
      })
      .catch(error => {
      console.error('Prijava nije uspjela:', error.response.data);
      setError(error.response.data.message);
      });

  }

  const goToSignUp = () => {
    router.push('/auth/sign-up');
  }

  return (
    <div className="flex flex-col justify-center min-h-screen py-2 bg-gray-100">
      {/* <Navbar /> */}
      <main className="flex flex-col items-center justify-center w-full flex-1 px-5 lg:px-20 min-h-screen bg-gray-100 text-center">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col lg:flex-row w-full lg:w-2/3 max-w-4xl">
          <div className="w-full lg:w-3/5 p-5">
            <div className="text-left font-bold">
              <span className="text-blue-800">Company</span>Name
            </div>
            <div className="py-24">
              <h2 className="text-3xl font-bold text-blue-800">Sign in to Account</h2>
              <div className="border-2 w-10 border-blue-800 inline-block mb-2"></div>
              
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3">
                  <FaRegEnvelope className="text-gray-400 mr-2"/>
                  <input type="email" name="email" placeholder="Email" className="bg-gray-100 outline-none flex-1 " onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="bg-gray-100 w-full lg:w-64 p-2 flex items-center mb-3">
                  <MdLockOutline className="text-gray-400 mr-2"/>
                  <input type="password" name="password" placeholder="Password" className="bg-gray-100 outline-none flex-1" onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="flex justify-between w-full lg:w-64 mb-5 ">
                  <label className="flex items-center text-xs">
                    <input type="checkbox" name="remember" className="mr-1"/>
                    Remember me 
                  </label>
                  <a href="#" className="text-xs">Forgot Password?</a>
                </div>
                <button className="border-2 border-blue-800 text-blue-800 rounded-full px-12 py-2 inline-block font-semibold hover:bg-blue-800 hover:text-white" onClick={goToSignIn}>Sign In </button>
              </div>
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
