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

function Product() {
    //const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['cart']); // cookie that stores cart only when user is not logged in. Cookie initialized below, this line just lets the code know the name of the cookie.
    //const [cartCount, setCount] = useState();
    const [product, setProduct] = useState(null); //state that contains the product data. data is pulled below.
    const [arrIndex, setArrIndex] = useState(0);
    const [imgIndex, setIndex] = useState(0); //state that contains the product data. data is pulled below.
    const [priceIndex, setPriceIndex] = useState(0); // state to track the current image index for the product images.
    const { id } = useParams(); // product id is stored in url and is assigned to {id} here.
    const { user, setUser } = useOutletContext();//state contains session information such as name and cart, is passed down from App.js
    const [quantity, setQuantity] = useState(0);
    //const [currentQuantity, setCurrQ] = useState(0); // deprecated code.
    //const [requestedAmnt, setAmnt] = useState(null);

    
    const inputRef = useRef(null); // Create a ref for the h1 displaying the current quantity of the product in cart.
    const imgRef = useRef(null); // Create a ref for the img displaying the current product image.
    //const [errorTrigger, setErrorTrigger] = useState(0);// deprecated error check.
    //const [hasError, setHasError] = useState(false);

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
    }, [id, setProduct])
    
    useEffect(() => {
        if(product) {
        setIndex(0);
        imgRef.current.src = typeof product.images[arrIndex]== 'object'? product.images[arrIndex][imgIndex] : product.images[arrIndex] ;
        setQuantity(product.quantityArray.length > 0 ? product.quantityArray[arrIndex] : product.quantity);
        //setPriceIndex(product.priceArray.length > 0 ? 0 : null);
        }

    }, [arrIndex, product]);

    /*useEffect(() => {
        if(user && product) {
            setCurrQ(user.cart.find(e => e.product._id === product._id)?.requestedAmnt || 0);
            
        }

    }, [user, product])*/
    
    // adds the product to the cart for the first time
     const add2Cart =async () => {
        
        
        try{
        console.log(priceIndex)
            let response = await axios.post('http://localhost:8080/add2Cart', {productID:product._id, sizeIndex: product.priceArray.length > 0 ? priceIndex : null}, {
                                withCredentials: true 
                            });
            setUser(response.data.user);
            console.log(priceIndex != null ? priceIndex : null)
        }
        catch(error){
            console.log(error);
            
        }
        
        
    }

   
    

// adjusts the quantity of a pre-existing product in cart
    const  handleQuantityChange = async (maxAllowed, requestedAmnt) => {
        
        let value = requestedAmnt;
       
        
        //console.log(typeof value);

        if(value >= maxAllowed) {
            value = maxAllowed;
        }
                                
        let response = await axios.post('http://localhost:8080/updateCart', {productID:product._id, input:parseInt(value), arrIndex:arrIndex}, {
            withCredentials: true 
        });
        console.log(response.data.user)
        setUser(response.data.user);    
    }

    function nextImg(index) {
        //console.log(index);
        typeof product.images[arrIndex] == 'object'? imgRef.current.src = product.images[arrIndex][index] : imgRef.current.src =product.images[index]
        //imgRef.current.src = product.images[arrIndex][index];
        setIndex(index);
    }
    

    
return (
    <div id="product">
    { product ? (
    <div className="flex flex-row justify-center items-center w-[100%] h-full gap-7">
        
    <h1 id="mobileTitle">{product.name}</h1>
        {/*
        
            SAVE STATE FOR CURRENT IMG INDEX AND COMBINE IMAGES INTO ONE LOCAL ARRAY
            <div className="smallerImgs">
                <img src={product.images[0]} alt="" />
                <img src={product.images[1]} alt="" /> 
                
            </div>
            <img id="bigImg" src={product.images[2]} alt="" />
        </div>*/}
        <div className="flex items-center gap-5">
            <img src={Left} ref={imgRef} alt="" className="w-[min(2vw,60px)] aspect-[1] object-cover block cursor-pointer transition-transform duration-100 ease-in-out hover:scale-120 active:scale-80" onClick={() => 
            {
                if(imgIndex == 0) {
                    nextImg(typeof product.images[arrIndex] == 'object'? product.images[arrIndex].length - 1 :product.images.length - 1)
                }
                else {
                    nextImg(typeof product.images[arrIndex] == 'object'? product.images[arrIndex].indexOf(imgRef.current.src) - 1 :product.images.indexOf(imgRef.current.src) - 1)
                }
            }}/>
            <img ref={imgRef} src={product.images[0][0]} alt="" className="w-[min(26vw,700px)]"/>
            <img src={Right} alt="" className="w-[min(2vw,60px)] aspect-[1] block object-cover cursor-pointer transition-transform duration-100 ease-in-out hover:scale-120  active:scale-80" onClick={() => 
            {
                if(imgIndex == product.images[arrIndex].length - 1) {
                    nextImg(0)
                }
                else {
                    nextImg(product.images[arrIndex].indexOf(imgRef.current.src) + 1)
                }
            }}/>
        </div>
        <div id="titleDiv">
            <h1 id="productTitle">{product.name}</h1>
            <div id="productInfo">
                <div className="flex gap-5 items-center">

                    {
                        product.sizeArray.map((size, index) => (
                            <button key={index} className="bg-[rgb(255,255,255)] hover:bg-[rgb(223,223,223)] cursor-pointer text-[rgb(160,110,44)] border-2 border-[rgb(0,0,0)] py-2 px-4 rounded-md transition-colors duration-300"
                            onClick={() => {
                                typeof product.images[0] == 'object'? setArrIndex(index) :setArrIndex(arrIndex);
                                product.priceArray.length > 0 ? setPriceIndex(index) : setPriceIndex(null);
                                product.quantityArray.length > 0 ? setQuantity(product.quantityArray[index]) : setQuantity(product.quantity);
                                //console.log( product.priceArray.length > 0 ? index : priceIndex);
                                //setArrIndex(index);
                                nextImg(0);
                            }}>
                                {size}
                            </button>
                        ))
                    }

                </div>
                
                
<p className="italic bg-white w-fit max-w-[min(50vw,800px)] text-[1.3rem] m-0 p-[3%] rounded-md border-solid border-[rgb(160,110,44)] border-[3px] whitespace-pre-line">
  {product.description.replace(/\\n/g, '\n')}
</p>
                <h1>${priceIndex !== null ? product.priceArray[priceIndex] : product.price}{"(" + (quantity) + " available)"}</h1>
                {/*If current product is not in cart it will display the add 2 cart button else it displays increment/decrement buttons*/}
                {!user.cart.some(item => item.product._id === product._id) ? 
                    <>
                    
                    <button type="submit" id="" className="transition-transform duration-500 ease-in-out hover:scale-110 active:scale-80 cursor-pointer flex justify-center items-center p-2 w-[fit] text-[min(2vw,25px)] aspect-[16/9] bg-[rgb(146,255,95)] rounded-[5px]" onClick={add2Cart}>Add to Cart</button>
                    
                    </>
                :
                    
                        <>
                        <div className="flex flex-col items-center justify-center border-4 border-[#f9ae04] rounded-[5px] w-fit h-fit">
                            <div className="flex flex-col gap-5 items-center p-1">
                                <div className="flex gap-5 items-center">
                                <img src={Minus} className="w-[min(2vw,60px)] aspect-[1] cursor-pointer transition-transform duration-100 ease-in-out hover:scale-120 active:scale-80" alt="" onClick={() => {
                                    --inputRef.current.textContent;
                                    handleQuantityChange(product.quantity, inputRef.current.textContent || 0)}}/>


                                <h1 ref={inputRef}>{user.cart.find(e => e.product._id === product._id)?.requestedAmnt || 0}</h1>
                                
                                <img src={Plus} className="w-[min(2vw,60px)] aspect-[1] cursor-pointer transition-transform duration-100 ease-in-out hover:scale-120 active:scale-80" alt="" onClick={() => {
                                    if(inputRef.current.textContent < (product.quantityArray? product.quantityArray[arrIndex] : product.quantity) ) {
                                    ++inputRef.current.textContent;
                                    handleQuantityChange(product.quantity, inputRef.current.textContent || 0)
                                    }
                                    console.log(inputRef.current.textContent);
                                    }}/>
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
