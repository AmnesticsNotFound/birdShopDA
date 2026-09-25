import { useEffect, useState, useRef } from 'react';
import React from "react";
import { useParams } from "react-router-dom";
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

function Info() {
    //const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['cart']); // cookie that stores cart only when user is not logged in. Cookie initialized below, this line just lets the code know the name of the cookie.
    //const [cartCount, setCount] = useState();
    const [product, setProduct] = useState(null); //state that contains the product data. data is pulled below.
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

    // sets product state with product data on mount(also on id change but the id will never change. the setProduct dependency is also there just because eslint cries about it)
    /*useEffect(() => {
        async function getProduct() {
            //event.preventDefault();
            //let res = await axios.get('https://birdshop-fullstack.onrender.com/getCatalog');

            let res = await urlPrefix.get(`/getProduct/${id}`, ); // Use the helper function
            setProduct(res.data);
            //console.log(res.data._id);
        }
        getProduct();
    }, [id, setProduct])
 */
    

    

// Render your button

return (
   <>
   
   </>
)
}

export default Info;
