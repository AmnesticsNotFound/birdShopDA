import { useState } from 'react';
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavBar from './NavBar.jsx'
import { useEffect } from 'react';
import '/public/style/App.css';
import Cart from '../data/Cart.js';
import axios from 'axios';
import {useCookies} from 'react-cookie';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['cart']);

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
          console.log(response.data.user)
        }
        else {
          
            setCookie('cart', [], {
                path:"/",
                maxAge: 60*60*24,
                secure: true,
                sameSite: "lax",
            });
        
        }
      } catch (error) {
        console.error("Could not restore session:", error);
      } finally {
        setLoading(false); // Stop showing the loading screen
      }
    };

    fetchUserDataFromSession();
  }, []);

  if (loading) return <div>Loading your Parrot Shop...</div>;
  return (
    <>
    <NavBar user={user} setUser={setUser}></NavBar>
      
    <Outlet context={{user, setUser}}></Outlet>
      
    </>
  )
}

export default App

//<Link to="/shop">Click here to go to Shop</Link>
//<Outlet />
     