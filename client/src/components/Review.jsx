import { useState } from 'react';
import { useEffect } from 'react';
import {useCookies} from 'react-cookie';
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

import goldStar from "/src/assets/images/goldStar.png";
import '/public/style/Testimonials.css';



function Review(props) {
    let rating = Array.apply(null, Array(props.rating)).map(function () {});
    //console.log(props)
    return (
        <div className="w-[100%] aspect-[1] flex p-1 items-center justify-center rounded-md border-[10px] border-transparent hover:border-blue-200 transition-colors duration-500 ease-in-out">
        <div className="relative flex flex-col gap-2 items-center w-[100%] aspect-[1] text-[white] bg-[rgb(51,51,51)] p-[2%] rounded-md border-double border-[20px] border-[white]">
            
                <p className="w-fit">{props.parrots}</p>
            
            
            <div className="flex">
                {
            rating.map((elem, index) => {
               
                
                
                return (
                    <img  className="star" key ={index} src={goldStar} alt="" />
                )
            
            })
            }
              
                
            
            </div>
            <div className="overflow-y-scroll min-h-[50%] max-h-[75%]">
                <p>{props.description}</p>
            </div>
            <h1 className="text-[1.2rem] text-[#fbd016] absolute bottom-3">{props.name}</h1>
        </div>
        </div>
    )

}
export default Review;