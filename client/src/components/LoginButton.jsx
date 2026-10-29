import { useState, useRef } from 'react';
import { useEffect } from 'react';
import {useCookies} from 'react-cookie';
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import '/public/style/NavBar.css';
//import Cart from '../data/Cart.js';
import Logo from "../assets/images/Logo.png";
import Cart from "../assets/images/cart.png";
import axios from 'axios';
import Logout from '../assets/images/Logout.png';
axios.defaults.withCredentials = true; // 🔑 Automatically handles cookies
import { GoogleLogin } from '@react-oauth/google';
function LoginButton({user,setUser}) {


    return(
        user.email == "guest" ? (
      
      
    <div className="flex justify-center items-center">
      
      <GoogleLogin
        theme=""
        shape=""
        text="signin"
        onSuccess={async (credentialResponse) => {
          console.log(`I am running`)
          //event.preventDefault(); 
          console.log("Success! Token received:", credentialResponse.credential);
          // 🚀 THIS IS THE GOLDEN TICKET: 
          // Send credentialResponse.credential via fetch/axios to your Node.js backend!
          try {
            // Send the token to your Node.js backend
            const response = await axios.post('http://localhost:8080/login', {
              token: credentialResponse.credential
            });

            const data = response.data;
            console.log('User synced with Backend & DB:', data.user);
            setUser(data.user);
            window.location.reload(); // Refresh the page to reflect the logged-in state
            // TODO: Save data.user to your React state/context or localStorage here!
          } catch (error) {
            console.error('Error logging in to backend:', error);
          }
        }}
        
        onError={() => {
          
          console.log('Login Failed');
        }
      }
      />
    </div>
  ) : (
    <div className="flex items-center gap-1">
    <div className="relative group w-max">
  {/* Main Profile Button */}
  <button className="cursor-pointer flex m-0 gap-[min(1vw,20px)] bg-[#ffffff] rounded-md group-hover:rounded-b-none w-[8vw] max-w-[200px] items-center text-[min(0.8vw,20px)] transition-all z-10 relative shadow-sm">
    <img 
      className="w-[3.5vw] max-w-[100px] m-0" 
      src={user.picture} 
      alt={`${user.name}'s profile`} 
    />
    <span className="truncate">{user.name}</span>
  </button>

  {/* Hover Dropdown Menu */}
  <div className="absolute top-full left-0 w-full bg-[#ffffff] hidden group-hover:flex flex-col rounded-b-md shadow-md overflow-hidden z-20 border-t border-gray-100">
    <Link to="/user/orders" className="px-4 py-2 text-[min(0.8vw,16px)] text-left hover:bg-gray-100 transition-colors">Order History</Link>
    <div className="px-4 py-2 text-[min(0.8vw,16px)] text-left hover:bg-gray-100 transition-colors cursor-pointer" onClick={handleManageBilling}>Personal Info</div>
    <Link to="/user/reviews" className="px-4 py-2 text-[min(0.8vw,16px)] text-left hover:bg-gray-100 transition-colors">Review History</Link>
    <Link className="flex items-center text-center gap-1 px-4 py-2 text-[min(0.8vw,16px)] text-left hover:bg-gray-100 transition-colors" onClick={async () => {
      try {
      // Send the request to clear the cookie and kill the database session
        await axios.post('http://localhost:8080/logout', {}, {
        withCredentials: true // 🔑 CRITICAL: Tells the browser to send the cookie so the backend knows which session to kill
      });

      // Clear your React state so the UI updates instantly
      setUser(cookies.user);
      } catch (error) {
        console.error("Error logging out:", error);
      }
       
      }}>
      <img className="cursor-pointer h-[1vw] max-h-[30px]" src={Logout} alt="Logout" />
      Logout
    </Link>
  </div>
</div>
      
      
      </div>
      
  )
    )
}

export default LoginButton;