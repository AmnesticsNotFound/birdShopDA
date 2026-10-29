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
import Delete from "../assets/images/Delete.png";
import Cart from "../assets/images/cart.png";

import '/public/style/Product.css';
//import Cart from '../data/Cart.js';
import { set } from 'mongoose';

function Product() {
    //const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['user']); // cookie that stores cart only when user is not logged in. Cookie initialized below, this line just lets the code know the name of the cookie.
    //const [cartCount, setCount] = useState();
    const [product, setProduct] = useState(null); //state that contains the product data. data is pulled below.
    const { id } = useParams(); // product id is stored in url and is assigned to {id} here.
    const { user, setUser } = useOutletContext();//state contains session information such as name and cart, is passed down from App.js
    //const [currentQuantity, setCurrQ] = useState(0); // deprecated code.
    //const [requestedAmnt, setAmnt] = useState(null);
    //const [cart, setCart] = useState(null);
    /*if(!user) {
        setUser(cookies.user)
    }*/
    //const [cart, setCart] = useState(user ? user.cart : cookies.cart);
    const inputRef = useRef(null); // Create a ref for the h1 displaying the current quantity of the product in cart.
    //const [errorTrigger, setErrorTrigger] = useState(0);// deprecated error check.
    //const [hasError, setHasError] = useState(false);

    console.log(user)
    /*useEffect(() => {
        
        if(user) {
            setCart(user.cart)
        }
        else {
            setCart(cookies.cart)
            console.log(cart)
        }
        console.log(user)
    }, [user, cookies.cart])*/

    /*useEffect(() => { 
        cart = user ? user.cart : cookies.cart;
    }, [cookies.cart, user]);*/

    //console.log(user.cart);
    // sets product state with product data on mount(also on id change but the id will never change. the setProduct dependency is also there just because eslint cries about it)
    useEffect(() => {
        async function getProduct() {
            //event.preventDefault();
            //let res = await axios.get('https://birdshop-fullstack.onrender.com/getCatalog');

            let res = await urlPrefix.get(`/getProduct/${id}`, ); // Use the helper function
            setProduct(res.data);
            //console.log(res.data._id);
        }
        getProduct();
    }, [])

    /*useEffect(() => {
        if(user && product) {
            setCurrQ(user.cart.find(e => e.product._id === product._id)?.requestedAmnt || 0);
            
        }

    }, [user, product])*/
    
    // adds the product to the cart for the first time
     const add2Cart =async () => {
        
        
        try{
            if(!user) {
                let response = await axios.get('http://localhost:8080/guestLogin', {
                                withCredentials: true 
                            })
                console.log(response.data.user);
                setUser(response.data.user);

            }
            let response = await axios.post('http://localhost:8080/add2Cart', {
                    product: {_id:product._id, name:product.name},
                    key: product.key, // Append the priceIndex to the key if it exists
                    requestedAmnt: 1,
                    priceAtPurchase:product.price,
                    category: product.category,
                    quantity: product.quantity,
                    img:product.images[0]
                }, {
                                withCredentials: true 
                            });
            setUser(response.data.user);
            //setCart(response.data.user.cart);
            console.log(response.data.user.cart)
        }
        catch(error){
            console.log(error);
            
        }
    
    /*else {
        //console.log(cart);
        const newCart = [...cookies.user.cart, {
          product: product._id,
          key: product.key,
          requestedAmnt: 1,
          priceAtPurchase: product.sizeIndex != null ? product.priceArray[product.sizeIndex] : product.price,
          category: product.category,
          sizeIndex: product.sizeIndex != null ? product.sizeIndex : null,
          img: product.images[0]
        }]

        const newUser = {
            
        name: "guest",
        picture: undefined,
        email: "guest",
        cart: newCart,   // Starts empty
        orders: []  // Starts empty
      
        }
        setCookie('user', newUser, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
        secure: true,
        sameSite: "lax",
    });
    setUser(newUser);
    
}
     */   
        
    }

   
    

// adjusts the quantity of a pre-existing product in cart
    const  handleQuantityChange = async (maxAllowed, requestedAmnt) => {
        
        let value = requestedAmnt;
       
        
        console.log(typeof value);

        if(value >= maxAllowed) {
            value = maxAllowed;
        }
                     
        
            console.log(value)
            let response = await axios.post('http://localhost:8080/updateCart', {productID:product._id, input:parseInt(value)}, {
                withCredentials: true 
            });
        
        setUser(response.data.user);
            //setCart(response.data.user.cart);
    
    /*else {
        console.log("Updating cart cookie...");
        let newCart;
        if(value != 0) {
            newCart = user.cart.map((item) =>
            item.product === product._id
                ? { ...item, requestedAmnt: parseInt(value) }
                : item
            );
            const newUser = {
            
                name: "guest",
                picture: undefined,
                email: "guest",
                cart: newCart,   // Starts empty
                orders: []  // Starts empty
      
            }
            setCookie('user', newUser, {
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
            secure: true,
            sameSite: "lax",
        });
    setUser(newUser);
        }
        else {
            console.log("Removing item")
            newCart = user.cart.filter((item) => item.product !== product._id);
        }
        /*const newCart = [...cookies.cart, {
          product: product._id,
          key: product.key,
          requestedAmnt: 1,
          priceAtPurchase: product.sizeIndex != null ? product.priceArray[product.sizeIndex] : product.price,
          category: product.category,
          sizeIndex: product.sizeIndex != null ? product.sizeIndex : null
        }]*/
        /*const newUser = {
            
        name: "guest",
        picture: undefined,
        email: "guest",
        cart: newCart,   // Starts empty
        orders: []  // Starts empty
      
        }
        setCookie('user', newUser, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
        secure: true,
        sameSite: "lax",
    });
    setUser(newUser);
    
}*/
    }
    

    
return (
    <div id="product">
    { product ? (
    <div className="flex flex-row justify-center items-center w-[100%] h-full gap-5">
        
    <h1 id="mobileTitle">{product.name}</h1>
    
        <div id="imgGroup">
            
            <div className="smallerImgs">
                <img src={product.images[0]} alt="" />
                <img src={product.images[1]} alt="" /> 
                
            </div>
            <img id="bigImg" src={product.images[2]} alt="" />
        </div>
        
        <div id="titleDiv">
            <h1 id="productTitle">{product.name}</h1>
            <div id="productInfo">
                
                <p style={{fontStyle: "italic"}}>{product.description}</p>
                <h1>${product.price}{"(" + product.quantity + " available)"}</h1>
                {/*If current product is not in cart it will display the add 2 cart button else it displays increment/decrement buttons*/}
                {!user || !user.cart.some(item => item.product._id === product._id) ? 
                    <>
                    {}
                    <button type="submit" id="" className="transition-transform duration-500 ease-in-out hover:scale-110 active:scale-80 cursor-pointer flex justify-center items-center p-2 w-[fit] text-[min(2vw,25px)] aspect-[16/9] bg-[rgb(146,255,95)] rounded-[5px]" onClick={add2Cart}>Add to Cart</button>
                    
                    </>
                :
                    
                        <>
                        {/*console.log(cartRef.some(item => item.product === product._id))*/}
                        <div className="flex flex-col items-center justify-center border-4 border-[#f9ae04] rounded-[5px] w-fit h-fit">
                            <div className="flex flex-col gap-5 items-center p-1">
                                <div className="flex gap-5 items-center">
                                <img src={Minus} className="w-[min(2vw,60px)] aspect-[1] cursor-pointer transition-transform duration-100 ease-in-out hover:scale-120 active:scale-80" alt="" onClick={() => {
                                    --inputRef.current.textContent;
                                   if(inputRef.current.textContent >= 0) {
                                        handleQuantityChange(product.quantity, inputRef.current.textContent || 0)
                                    }}}/>


                                <h1 ref={inputRef}>{user && user.cart.find(e => e.product._id === product._id)?.requestedAmnt || 0}</h1>
                                
                                <img src={Plus} className="w-[min(2vw,60px)] aspect-[1] cursor-pointer transition-transform duration-100 ease-in-out hover:scale-120 active:scale-80" alt="" onClick={() => {
                                    if(inputRef.current.textContent < product.quantity) {
                                    ++inputRef.current.textContent;
                                    }
                                    handleQuantityChange(product.quantity, inputRef.current.textContent || 0)}}/>
                                </div>

                                <img  src={Delete} className="w-[min(2vw,60px)] aspect-[1] cursor-pointer transition-transform duration-100 ease-in-out hover:scale-120 active:scale-80" 
                                onClick={() => handleQuantityChange(product.quantity, 0)} alt="Remove item"/>
                            </div>
                            <div className="flex w-[100%]">
                                <img src={Cart} alt="" className="w-[min(1vw,30px)] aspect-[1]"/>
                            </div>
                            
                        </div>
                        <h3 className="text-[min(0.7vw,20px)] font-bold text-[#f9ae04]">In cart</h3>
                        </>
                        
                            
                    
                    
                
                
                }
                {/*hasError && (
                    <div key={errorTrigger}>
                        <h3 id="tooLarge" className="text-red-500 animate-[shake_0.4s_ease-in-out]">Not that many available</h3>
                        
                    </div>
                )*/}
                {//UPDATE CART.JS AND THEN READ DATA AND ADD TO CART IN NAVBAR
                }
            </div>
        </div>
    </div>) :(<p>Product not found</p>)}
    </div>
)
}

export default Product;
