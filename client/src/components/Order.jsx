import { useEffect, useState, useRef } from 'react';
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {useCookies} from 'react-cookie';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import urlPrefix from '../client'; // Import your helper

import Plus from "../assets/images/plus.png";
import Minus from "../assets/images/minus.png";
import Left from "../assets/images/left.svg";
import Right from "../assets/images/right.svg";
import Delete from "../assets/images/Delete.png";
import Cart from "../assets/images/cart.png";

import '/public/style/Product.css';
//import Cart from '../data/Cart.js'; 
import { set } from 'mongoose';

function Order() {
    //const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['cart']); // cookie that stores cart only when user is not logged in. Cookie initialized below, this line just lets the code know the name of the cookie.
    //const [cartCount, setCount] = useState();
    const [orders, setOrders] = useState(null); //state that contains the product data. data is pulled below.
    const [order, setOrder] = useState(null);
    const { id } = useParams(); // product id is stored in url and is assigned to {id} here.
    const { user, setUser } = useOutletContext();//state contains session information such as name and cart, is passed down from App.js
    //const [currentQuantity, setCurrQ] = useState(0); // deprecated code.
    //const [requestedAmnt, setAmnt] = useState(null);

    
    const inputRef = useRef(null); // Create a ref for the h1 displaying the current quantity of the product in cart.
    const imgRef = useRef(null); // Create a ref for the img displaying the current product image.
    //const [errorTrigger, setErrorTrigger] = useState(0);// deprecated error check.
    //const [hasError, setHasError] = useState(false);

   // sets product state with product data on mount(also on id change but the id will never change. the setProduct dependency is also there just because eslint cries about it)
    useEffect(() => {
        async function getOrder() {
            //event.preventDefault();
            //let res = await axios.get('https://birdshop-fullstack.onrender.com/getCatalog');

            let res = await urlPrefix.get(`/getOrder/${id}`, ); // Use the helper function
            setOrder(res.data);
            //console.log(res.data._id);
        }
        getOrder();
    }, [id, setOrder])
    

    
return (
    <>
        {order && (
            <div className="flex flex-col border-4 border-black w-[60vw] h-fit">
                <div className="w-full border-1 flex justify-between">
                    <p >Order ID: <strong>{order._id}</strong></p>
                    <p >Date: <strong>{order.date.split('T')[0]}</strong></p>
                </div>
                {
                    order.products.map((item, index) => (
                        item.product.category === "Parrot" ? (
                        <div key={index} className="w-full flex justify-between">
                            <div className="flex w-[50%] items-center">
                                <img src={item.product.images[0]} alt={item.product.name} className="w-32 h-32 object-cover"/>
                                <p className="ml-4">{item.product.name}</p>
                            </div>
                            <div className="flex flex-col w-[50%] justify-center items-end">
                                <p className="mr-9">Quantity: <strong>{item.product.quantity}</strong></p>
                                <p className="mr-3">Price: <strong>${item.product.price.toFixed(2)}</strong></p>
                            </div>
                        </div>
                        ) : (
                            <div key={index} className="w-full flex justify-between">
                            <div className="flex w-[50%] items-center">
                                <img src={item.product.images[0][0]} alt={item.product.name} className="w-32 h-32 object-cover"/>
                                <p className="ml-4">{item.product.name}</p>
                            </div>
                            <div className="flex flex-col w-[50%] justify-center items-end">
                                <p className="mr-9">Quantity: <strong>{item.product.quantity}</strong></p>
                                <p className="mr-3">Price: <strong>${item.product.price.toFixed(2)}</strong></p>
                            </div>
                        </div>
                        
                    )))
                }

             
                <p className="w-full flex justify-end pr-6 border-1">Total: <strong>${order.total.toFixed(2)}</strong></p>
            </div>
        )}
        </>
    
)
}

export default Order;
