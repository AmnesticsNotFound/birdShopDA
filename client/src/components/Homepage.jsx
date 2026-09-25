/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import NavBar from './NavBar.jsx'
import '/public/style/Homepage.css';
//import '/public/style/App.css';
import Dave from "../assets/images/Dave.png";
import Fight from "../assets/images/Fight.png";
import Hatchery from "../assets/images/Hatchery.png";
import Sale from "../assets/images/Sale.png";
import Award1 from "../assets/images/2024.png";
import Award2 from "../assets/images/2025.png";
import Award3 from "../assets/images/Diet.png";
import Hyacinth from "../assets/images/Hyacinth.png";
import Scarlet from "../assets/images/Scarlet.png";
import Bar from "../assets/images/Bar.png";
import Storefront from "../assets/images/Storefront.png";
function Homepage() {



    return (
      <div id="shell">
        <div id="mainHome">
          <div className="flex flex-col w-fit h-fit items-center gap-5 mt-10 border-b-5">
            <div id="imgBanner">
              <img src="https://i.imgur.com/Wzf6kJO.png" id="leftBird" alt="" />
            <img src={Sale} id="" className="aspect-[32/9] w-[50%] border-5 border-solid rounded-md" alt="" /> 
            <img src="https://i.imgur.com/Wzf6kJO.png" id="rightBird" alt="" />
          </div>

            <div className="flex flex-col items-center w-full ">
              
              <h1  className="homepageStyle text-[xx-large] p-0 absolute ">Welcome to our corner<br></br>&emsp;&emsp;&nbsp;of the internet!</h1>
              <div className= "flex items-center">
                <img src={Hyacinth} alt="" className="w-30 aspect-[9/16]" />
                <img src={Bar} alt="" className="w-120 mt-4" />
                <img src={Scarlet} alt="" className="w-30 aspect-[9/16]" />
              </div>
              </div>
            {/*<div className="flex flex-col items-center justify-center w-full">
              <img src="https://i.imgur.com/G4ljJqz.jpeg" id="mainImg" alt="" />
              
            </div>*/}
          </div>
          
          
          <div className="flex flex-col items-center justify-center bg-[#CBCBD4] w-full aspect-[32/10] rounded-md border-b-5">
         
          <p id="" className=" border-[#001155] text-[135%] w-screen aspect-[21/9] max-w-[900px] leading-[1.15] p-[1%] 
          rounded-md  bg-[#0A2342] text-[#D7BA89]">
            Here at Avian Avenue we have a variety of species and morphs, but we still value quality over quantity.
            Our selection may not be as diverse as some breeders out there, but their variety often comes at the cost
            of quality! Their avian friends are often kept in confined locations with many other birds of varying species.
            <br /><br />
            How can they stretch their wings? Or be happy? Do they have the time/enough people to socialize or entertain them?
            Some do, some don't and it is often impossible to verify their claims if they live far away(which is often the case).
            Our small team does not peck off more than they can chew and providle ample time for each of our feathered friends as well
            as time for answering questions! Feel free to also schedule an in person appointment with us, just be sure to do it weeks in advance.
            <br /><br />
            Check out our selection up top!
          </p>
          <div className="flex flex-row gap-10 mt-5 w-[25%] justify-center items-center rounded-md">
              <img src={Award1} className="w-25 aspect-[1]" alt="" />
              <img src={Award3} className="w-30 aspect-[1]" alt="" />
              <img src={Award2} className="w-25 aspect-[1]" alt="" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-[white] w-full border-b-5">
          <div className="flex flex-column gap-5 justify-center mt-5">
            <img src={Fight} id="" alt="" className="w-100 h-70  border-[#0a2342] border-solid rounded-md"/>

            <img src={Dave} id="" alt="" className="w-170 h-120 border-6 border-[#0a2342] border-solid  rounded-md"/>
            
            <img src={Hatchery} id="" alt="" className="w-100 h-70  border-[#0a2342] border-solid rounded-md"/>
          </div>
          <h1 className=" homepageStyle text-[x-large]">Hi, I'm Dave.<br /><br /></h1>
          <p className="text-[#0A2342] border-2 bg-[#cbcbd4] text-[#0a2342] w-[60%] leading-[1.3] p-[1%] 
          rounded-md  rounded-md mb-5">
          &emsp;I'm the guy that decided to stick with this business for the past two decades. I still work a real job, unfortunately, accounting is pretty lucrative.
          My love for our feathered friends, sometimes fiends, began when I was about 30. My aunt was heading out of town and needed someone to watch her budgie.
          Naturally, I enjoyed the company of the little thing more than I expected. I eventually had to give her back and decided to get a bird of my own: a Crimson Bellied
          Conure named Gobby. She still flies among us even in her old age and is what brought us here today. The shop on this page is my baby or hatchling, some might say.
           It's had its ups and downs — believe me, but I think it turned out all right. Thanks to people like you, I have been to able raise our avian friends;
           from conures, to macaws, and eclectus, I have raised just about everything.<br /><br />

           &emsp;Take your time picking out a bird for you, but not too long, they get lonely! However, I do advise you do your own research regarding parrots and their care. The species
           vary and are tame, NOT domesticated. They can be trained, but are not eager to please like dogs. I do not mean to intimidate you, but many people bite off more than they can chew and in turn the bird may
            take a bite of you. Birds are very social and become easily attached; if you cannot provide an ample amount of time for your bird, then simply do NOT purchase one. They are NOT
            to be left in a cage, in a corner like some decorative piece.<br /><br />
            
            &emsp;If you have any questions about the birds or the process, don't hesitate to reach out to me and my team. We are here to help you find your new best friend and make sure they are well taken care of! 
          
          </p>
          </div>
          <div className="flex flex-col w-full bg-[#0a2342] items-center justify-center">
            <h1 className="text-[#c6c6d0] text-[xx-large] homepageStyle">Come and have a chat with us!</h1>
            <div className="flex flex-row w-[60%] items-center justify-center">
              <div className="w-[50%] flex flex-col items-center justify-center">
                
                
              
                <div className="max-w-md mx-auto my-6 overflow-hidden border border-[#c6c6d0] rounded-xl shadow-sm">
                  <table className="w-full text-left border-collapse text-sm text-black">
  <thead>
    <tr className="bg-[#c6c6d0] font-semibold">
      <th className="p-4 border-b border-[#c6c6d0]">Day</th>
      <th className="p-4 border-b border-[#c6c6d0]">Hours</th>
    </tr>
  </thead>
  <tbody>
    <tr className="text-[#c6c6d0]">
      <td className="p-4 font-semibold border-b border-gray-200">Monday</td>
      <td className="p-4 border-b border-gray-200">10:00 AM – 6:00 PM</td>
    </tr>

    <tr className="text-[#c6c6d0]">
      <td className="p-4 font-semibold border-b border-gray-200">Tuesday</td>
      <td className="p-4 border-b border-gray-200">10:00 AM – 6:00 PM</td>
    </tr>

    <tr className="text-[#c6c6d0]">
      <td className="p-4 font-semibold border-b border-gray-200">Wednesday</td>
      <td className="p-4 border-b border-gray-200">10:00 AM – 6:00 PM</td>
    </tr>

    <tr className="text-[#c6c6d0]">
      <td className="p-4 font-semibold border-b border-gray-200">Thursday</td>
      <td className="p-4 border-b border-gray-200">10:00 AM – 6:00 PM</td>
    </tr>

    <tr className="text-[#c6c6d0] border-gray-200 border-b-2">
      <td className="p-4 font-semibold border-b border-gray-200">Friday</td>
      <td className="p-4 border-b border-gray-200">8:00 AM – 4:00 PM</td>
    </tr>

    <tr className="text-[#c6c6d0]">
      <td className="p-4 font-semibold border-b border-gray-200">Saturday</td>
      <td className="p-4 border-b border-gray-200 flex justify-center">
        <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20">
          Closed
        </span>
      </td>
    </tr>

    <tr className="text-[#c6c6d0]">
      <td className="p-4 font-semibold">Sunday</td>
      <td className="p-4 flex justify-center">
        <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20">
          Closed
        </span>
      </td>
    </tr>
  </tbody>
</table>
                </div>
              </div>
              
              <img src={Storefront} className="aspect-[4/3] w-[50%] rounded-md"/>
            </div>
            <div id="contactDiv">
              
              <div id="contactInfo" className="">
                <h3 className="text-[#c6c6d0] bg-[#0a2342] border-1 border-[#c6c6d0] p-1 rounded-md">Email:<span> avianavenue1973@gmail.com</span></h3>
                <h3 className="text-[#c6c6d0] bg-[#0a2342] border-1 border-[#c6c6d0] p-1 rounded-md">Phone Number:<span> +1 (210) 333-4657</span></h3>
                <h3 className="text-[#c6c6d0] bg-[#0a2342] border-1 border-[#c6c6d0] p-1 rounded-md">Address:<span> 9407 Avian Avenue</span></h3>
              </div>
            </div>
          </div>
        </div>
        
    </div>
    
    )
}

export default Homepage;