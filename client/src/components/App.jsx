import { useState } from 'react';
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavBar from './NavBar.jsx'
import { useEffect } from 'react';
import '/public/style/App.css';
import Cart from '../data/Cart.js';
import axios from 'axios';
import {useCookies} from 'react-cookie';
import { set } from 'mongoose';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  useEffect(() => {
    const fetchUserDataFromSession = async () => {
      try {
        
        // 2. Hit the backend endpoint
        const response = await axios.get('http://localhost:8080/me', {
          // 🔑 CRITICAL: This tells Axios to pass the secure session cookie along with the request!
          withCredentials: true 
        });

        // 3. If the backend found a valid session, set your state!
        if (response.data.loggedIn) {
          
          setUser(response.data.user); 
          //console.log(response.data.user)
        }
        else {
          
          /*if(!cookies.user) {
           
            setCookie('user', {
        name: "guest",
        picture: undefined,
        email: "guest",
        cart: [],   // Starts empty
        orders: []  // Starts empty
      }, {
                path:"/",
                maxAge: 60*60*24,
                secure: true,
                sameSite: "lax",
            });
          }
          setUser(cookies.user);*/
        
        }
      } catch (error) {
        console.error("Could not restore session:", error);
      } finally {
        setLoading(false); // Stop showing the loading screen
      }
    };

    fetchUserDataFromSession();
  }, []);

  /*useEffect(() => {
    setCookie('user', user, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
        secure: true,
        sameSite: "lax",
    });
  }, [user, setCookie]);*/

  if (loading) return <div>Loading your Parrot Shop...</div>;
  return (
    <>
    <NavBar user={user} setUser={setUser} guest={cookies.user ? cookies.user : null}></NavBar>
      
    <Outlet context={{user, setUser}}></Outlet>
      
    </>
  )
}

export default App

//<Link to="/shop">Click here to go to Shop</Link>
//<Outlet />
     