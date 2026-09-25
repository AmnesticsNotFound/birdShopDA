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

function OrderHistory() {
    //const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['cart']); // cookie that stores cart only when user is not logged in. Cookie initialized below, this line just lets the code know the name of the cookie.
    //const [cartCount, setCount] = useState();
    const [orders, setOrders] = useState(null); //state that contains the product data. data is pulled below.
    const [arrIndex, setArrIndex] = useState(0);
    const [imgIndex, setIndex] = useState(0); //state that contains the product data. data is pulled below.
    const { id } = useParams(); // product id is stored in url and is assigned to {id} here.
    const { user, setUser } = useOutletContext();//state contains session information such as name and cart, is passed down from App.js
    //const [currentQuantity, setCurrQ] = useState(0); // deprecated code.
    //const [requestedAmnt, setAmnt] = useState(null);

    
    const inputRef = useRef(null); // Create a ref for the h1 displaying the current quantity of the product in cart.
    const imgRef = useRef(null); // Create a ref for the img displaying the current product image.
    //const [errorTrigger, setErrorTrigger] = useState(0);// deprecated error check.
    //const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchData() {
            let response = await axios.post('http://localhost:8080/getOrderHistory', {
                                withCredentials: true 
                            });
            setOrders(response.data);
            console.log(response.data);
        }
        fetchData();
  },[])
    

    
return (
    <div className="flex flex-col border-4 border-black w-[90vw] h-fit items-center">
        <p>Order History</p>

        { orders ?

            orders.map((order, index) => (     
                <Link to={`/user/orders/${order._id}`} key={index} className="border-6 border-red-500 rounded-md w-[50%] h-[min(12vh,300px)] cursor-pointer" >
                    <div className="w-full h-[15%] border-2 border-blue-500 flex justify-between">
                        <p>Order ID: {order._id}</p>
                        <p>Order Date: {order.date.split('T')[0]}</p>
                    </div>
                    
                    <div className="w-full h-[85%] border-4 border-green-300 flex justify-between items-end">
                        <div className="flex h-[100%] items-center">
                            {order.products.map((elem, idx) => (
                                <img key={idx} src={typeof elem.product.images[0] === "object"? elem.product.images[0][0] : elem.product.images[0]} alt={`Order ${order._id} Image ${idx}`} className="h-[70%] aspect-square object-cover" />
                            ))}
                        </div>
                        <p>Total: ${order.total.toFixed(2)}</p>
                    </div>
                </Link>
            )) : (<p>No orders found.</p>)
        }
    </div>
)
}

export default OrderHistory;
