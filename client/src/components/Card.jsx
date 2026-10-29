import { useState } from 'react';
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import '/public/style/Card.css';


function Card(props) {
    const product = props.product;
    const id = product._id;
    let path;
    let img;


    if(product.category=== "Parrot") {
        path = `/parrot/${id}`;
        img = product.images[0];
    } else {
        path = `/product/${id}`;
        //console.log(product.images[0][0] ? product.images[0][0] : product.images[0])
        img = typeof product.images[0] == 'object'? product.images[0][0] : product.images[0];
    }

    //stores product in local storage so I don't have to pull the data from back end every time its needed
    /*function saveProduct(){
        localStorage.setItem("product", JSON.stringify({id: id,
            key:product.key,
            name:product.name,
            description: product.description,
            imgs:product.images,
            price:product.price,
            quantity:product.quantity,
        }));
    }*/
    
/*
state={{id_: id,
            key:product.key,
            name:product.name,
            img:product.images[0],
            price:product.price,
            quantity:product.quantity,
        }}
*/
    return (
        
        <Link className="w-[min(20vw,600px)] h-[min(20vw,600px)] flex flex-col items-center" to={path} /*onClick={saveProduct}*/>
            <img className="w-[100%] aspect-[4/3] rounded-[5px] border-[7px] border-solid border-[rgb(0,17,85)]" src={img} alt="" />
            <h2 className="w-[100%] text-center text-[1rem]">{product.name}</h2>
        </Link>
        
       
        
    )

}


export default Card;