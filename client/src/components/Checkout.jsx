import { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import React from "react";
import { useParams } from "react-router-dom";
import Catalog from '../data/Catalog.js';
import Cart from '../data/Cart.js';
import '/public/style/Checkout.css';

import Plus from "../assets/images/plus.png";
import Minus from "../assets/images/minus.png";
import Delete from "../assets/images/Delete.png";

function Checkout() {
    const [cookies, setCookie, removeCookie] = useCookies(['cart']); // cookie that stores cart only when user is not logged in. Cookie initialized below, this line just lets the code know the name of the cookie.
    const { user, setUser } = useOutletContext();//user information is passed down from App.js.
    let cart = user ? user.cart : cookies.cart;// will be assigned to cookies.cart if no user is logged in. Cart is stored locally in a cookie when no user login

    // Map of refs, multiple refs. One for each product in cart
    const inputRefs = useRef(new Map()); 

    // function to handle steps and prevent manual typing from bypassing max/min caps
    const handleQuantityChange = async (productID, input, maxAllowed) => {
        //let input = parseInt(inputRefs.current.get(key).textContent);
        //if (!input) return;
        //let value = input;
       //console.log(input)
        //let oldVal = input.value;
        /*if (direction === 1) {
            ++input;
        }
        else {
            --input;
        }*/
        

       
        
        //console.log(typeof value);

        /*if(input >= maxAllowed) {
            input = maxAllowed;
        }*/
                                
        let response = await axios.post('http://localhost:8080/updateCart', {productID:productID, input:input}, {
            withCredentials: true 
        });
        setUser(response.data.user);    
         

         
    };

    async function removeItem(productID) {
        // Implement remove logic here
        let response = await axios.post('http://localhost:8080/deleteCartItem', {productID:productID}, {
                                withCredentials: true 
                            });
    }



   const handleCheckout = async () => {
  try {
    // Make the POST request to your Express server
    const response = await axios.post(
      'http://localhost:8080/checkout', 
      {}, // Empty body because backend pulls cart data from the session database
      { 
        withCredentials: true // 🔑 CRITICAL: Tells Axios to send your express-session cookie
      }
    );

    // If the backend successfully generated a Stripe URL, redirect the window
    if (response.data && response.data.url) {
        console.log('Redirecting to Stripe checkout:', response.data.url);
      window.location.href = response.data.url; // Or response.data.url depending on response structural nesting
      // More safely written as:
      // window.location.href = response.data.url;
    }
  } catch (error) {
    console.error('Checkout failed:', error.response?.data?.error || error.message);
    alert(error.response?.data?.error || 'Something went wrong during checkout.');
  }
};


    return (
        <div id="page">
            {cart && cart.length > 0 ? (
    // 1. FIXED: Outer wrapper is now a clean column flexbox, NOT a grid
    <div className="flex flex-col w-full">

        {/* 2. FIXED: Header row uses the exact same grid template as the items */}
        <div className="grid grid-cols-[3fr_3fr_3fr] gap-36 py-2 border-b border-gray-200 items-center text-center text-2xl">
            <h1 className="font-[copper] text-[rgb(160,_110,_44)] [text-shadow:2px_1px_1px_rgb(0,_0,_0)] font-bold">
                Name
            </h1>
            <h1 className="font-[copper] text-[rgb(160,_110,_44)] [text-shadow:2px_1px_1px_rgb(0,_0,_0)] font-bold">
                Quantity
            </h1>
            <h1 className="font-[copper] text-[rgb(160,_110,_44)] [text-shadow:2px_1px_1px_rgb(0,_0,_0)] font-bold ">
                Price
            </h1>
        </div>

        {/* 3. FIXED: Mapped item rows share the identical template layout */}
        {cart.map((elem) => (
            <div key={elem.key} className="grid grid-cols-3 gap-36 items-center py-3 border-b border-gray-100 text-center text-lg" >
                
                {/* COLUMN 1: Product Name */}
                <h1 className="font-medium text-gray-900 truncate my-8">
                    {elem.product.name}
                </h1>
                
                {/* COLUMN 2: Quantity Controls */}
                <div className="flex flex-col gap-5 items-center justify-center">
                    <div className="flex gap-3 items-center justify-center">
                    {/* Step Down Button */}
                    <img  
                        src={Minus} className="w-10 h-10 p-1 cursor-pointer transition-all duration-100 ease-in-out hover:p-0 active:p-2" 
                        onClick={() => {
                            let input = inputRefs.current.get(elem.product._id).textContent;
                            
                                --input;
                                handleQuantityChange(elem.product._id, input, elem.quantity)}}
                        alt="Decrease quantity"
                    />
                    
                    {/* Input Field 
                    <input 
                        type="number" 
                        ref={(el) => {
                            if (el) {
                                inputRefs.current.set(elem.product._id, el);
                            } else {
                                inputRefs.current.delete(elem.product._id);
                            }
                        }}
                        max={elem.product.quantity} 
                        min="0" 
                        className="w-12 text-center border border-gray-300 rounded-sm border-transparent rounded-sm hover:border-black transition-colors duration-400" 
                        defaultValue={elem.requestedAmnt}
                        onChange={() => handleQuantityChange(elem.product._id, 'enforce', elem.product.quantity, elem.requestedAmnt)}
                    />
                    */}                        
                    
                    <h1 ref={(el) => {
                            if (el) {
                                inputRefs.current.set(elem.product._id, el);
                            } else {
                                inputRefs.current.delete(elem.product._id);
                            }
                        }}>{user.cart.find(e => e.product._id === elem.product._id)?.requestedAmnt || 0}</h1>


                    {/* Step Up Button */}
                    <img  
                        src={Plus} className="w-10 h-10 p-1 cursor-pointer transition-all duration-100 ease-in-out hover:p-0 active:p-2" 
                        onClick={() => {
                            let input = inputRefs.current.get(elem.product._id).textContent;
                            //console.log(elem.product.quantity)
                            if(input < elem.product.quantity) {
                                ++input;
                                handleQuantityChange(elem.product._id, input, elem.product.quantity)}}
                            }
                            
                        alt="Increase quantity"
                    />
                    
                    </div>
                
                {/* Remove Button */}
                    <img  
                    src={Delete}
                        name={elem.product.name} 
                        className="w-7 h-7 cursor-pointer transition-transform duration-100 ease-in-out hover:scale-120 active:scale-80" 
                        onClick={() => handleQuantityChange(elem.product._id, '0', elem.product.quantity)}
                        alt="Remove item"
                    />

                
                </div>
                {/* COLUMN 3: Price */}
                <h1 className="font-semibold text-gray-900 text-center">
                    {"$" + elem.product.price}
                </h1>

            </div>
        ))}

        <button className="border-4 cursor-pointer" onClick={handleCheckout}>Checkout</button>
        
    </div>
) : (
    <h1 id="emptyCart">Empty Cart</h1>
)}

            
        </div>
    );
}

export default Checkout;