import { useEffect, useState, useRef } from 'react';
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {useCookies} from 'react-cookie';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import urlPrefix from '../client'; // Import your helper


import Review from './Review.jsx';
import '/public/style/Product.css';
//import Cart from '../data/Cart.js'; 
import { set } from 'mongoose';
import Trash from "../assets/images/trash.png";
import X from "../assets/images/x.png";

function ReviewHistory() {
    //const location = useLocation();
    const [cookies, setCookie, removeCookie] = useCookies(['cart']); // cookie that stores cart only when user is not logged in. Cookie initialized below, this line just lets the code know the name of the cookie.
    const { id } = useParams(); // product id is stored in url and is assigned to {id} here.
    const { user, setUser } = useOutletContext();//state contains session information such as name and cart, is passed down from App.js
    //const [currentQuantity, setCurrQ] = useState(0); // deprecated code.
    //const [requestedAmnt, setAmnt] = useState(null);
    //const [errorTrigger, setErrorTrigger] = useState(0);// deprecated error check.
    //const [hasError, setHasError] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [errorMsg, setErrorMsg] = useState(" ");
    const [popUp, setPopUp] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    let newReviewRating = selectedReview ? selectedReview.rating : undefined;
    async function getReviews() {
          let res = await urlPrefix.get('/getUserReviews');
          
          setReviews(res.data);
          //console.log(catalog);
        }

    useEffect( () => {
        
        getReviews();
    
    
      }, [])
      
       function saveRating(e) {
        let starGroup = document.querySelector('#newRevRating');
        starGroup = starGroup.children;
        //setSelectedReview({...selectedReview,rating: e.target.getAttribute('value')});
        newReviewRating = e.target.getAttribute('value');
        // set selected stars to yellow
        for(let i = newReviewRating; i < 5; ++i) {
          starGroup[i].src = 'https://i.imgur.com/bzDVI4C.png';
        }
        console.log(newReviewRating);
      }

      function starEnter(e) {
        let starGroup = document.querySelector('#newRevRating');
        starGroup = starGroup.children;
        //make currently hovered star and all before it yellow. Persists until no longer hovering
        for(let i = 0; i < parseInt(e.target.getAttribute('value')); ++i) {
          starGroup[i].src = 'https://i.imgur.com/X0qPEO5.png';
        }
        //make all stares ahead of currently hovered one white. Persists until no longer hovering
        for(let i = e.target.getAttribute('value'); i < 5; ++i) {
          starGroup[i].src = 'https://i.imgur.com/bzDVI4C.png';
        }
        
      }

      function starLeave(e) {
        let starGroup = document.querySelector('#newRevRating');
        starGroup = starGroup.children;
        if(newReviewRating == undefined) {
          
          //if no rating was selected, make all stars white upon ending hover
          for(let i = 0; i < 5; ++i) {
            starGroup[i].src = 'https://i.imgur.com/bzDVI4C.png';
          }
        } 
        else {
          //make selected stars yellow upon ending hover
          for(let i = 0; i < newReviewRating; ++i) {
            starGroup[i].src = 'https://i.imgur.com/X0qPEO5.png';
          }
          //make unselected stars white upon ending hover
          for(let i = newReviewRating; i < 5; ++i) {
            starGroup[i].src = 'https://i.imgur.com/bzDVI4C.png';
          }
        }
      }

    async function editReview(e) {
        //
        //console.log(e.target.revDescription.value.length);
        e.preventDefault();
        /*if (newReviewRating == undefined) {
          let errorElem = document.querySelector('#errorMsg');
          errorElem.innerText = "* Select Star Rating";
          
          
        }*/
        if (e.target.revDescription.value.length === 0) {
          let errorElem = document.querySelector('#errorMsg');
          errorElem.innerText = "* Missing Description";
          
          
        }
        else if (e.target.userName.value.length === 0) {
          let errorElem = document.querySelector('#errorMsg');
          errorElem.innerText = "* Missing Name";
          
          
        }
        else if(e.target.userName.value == selectedReview.name && e.target.revDescription.value == selectedReview.description && newReviewRating == selectedReview.rating) {
          let errorElem = document.querySelector('#errorMsg');
          errorElem.innerText = "* No Changes Made";
        }
        
        else {
          
          //const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(e.target.orderID.value);

          /*if (!isValidObjectId) {
            console.error("Invalid Order ID or review already exists");
            // Update your UI to show an error message
            let errorElem = document.querySelector('#errorMsg');
            errorElem.innerText = "* Invalid Order ID";
            return; 
          }*/

          // 2. Reactive: Handle the Axios request and catch server errors
          console.log(e.target)
          try {
            const response = await axios.post('http://localhost:8080/editReview', { 
              name:e.target.userName.value,
              description: e.target.revDescription.value,
              rating:newReviewRating ? newReviewRating : selectedReview.rating,
              orderID: e.target.orderID.value
            });
            
            // Axios automatically parses JSON, so you can access data directly
            console.log("Success:", response.data);
            setReviews(response.data);
            setPopUp(false);
            //window.location.reload()
            
          } catch (error) {
            // Check if the error came from the server (e.g., 400 Bad Request, 500 Server Error)
            if (error.response) {
              console.error("Server rejected the request:", error.response.data.error);
              let errorElem = document.querySelector('#errorMsg');
              errorElem.innerText = "* " + error.response.data.error;
              // Example UI update: showError(error.response.data.message || "Server error");
              
            // Check if the request was made but no response was received (e.g., network failure)
            } else if (error.request) {
              console.error("No response from server. Check your network.", error.request);
              
            // Check if something else went wrong setting up the request
            } else {
              console.error("Error setting up request:", error.message);
            }
          }
        
        
      }

        //console.log(res.data);
      }

      async function deleteReview() {
        try {
          const response = await axios.post('http://localhost:8080/deleteReview', { 
            id: selectedReview._id
          });
          
          // Axios automatically parses JSON, so you can access data directly
          console.log("Success:", response.data);
          //setReviews(response.data);
          setPopUp(false);
          getReviews();

      }
      catch (error) {
        // Check if the error came from the server (e.g., 400 Bad Request, 500 Server Error)
        if (error.response) {
          console.error("Server rejected the request:", error.response.data.error);
          let errorElem = document.querySelector('#errorMsg');
          errorElem.innerText = "* " + error.response.data.error;
          // Example UI update: showError(error.response.data.message || "Server error");
          
        // Check if the request was made but no response was received (e.g., network failure)
        } else if (error.request) {
          console.error("No response from server. Check your network.", error.request);
          
        // Check if something else went wrong setting up the request
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    }

    
return (
    <div className="flex flex-col border-4 border-black w-[90vw] h-fit items-center">
        <p>Review History</p>
        <div className={`grid grid-cols-[repeat(${reviews.length > 1 ? 2 : 1},min(20vw,500px))] w-[min(60vw, 1500px)] justify-center justify-items-center`}>
        { reviews ?

            reviews.map((elem, index)=> {
              if (index > 3) {
                //console.log(index);
                return;
              }
              else {
            return (
              <div onClick={() => { setSelectedReview(elem); setPopUp(true); }} key={elem._id} className="cursor-pointer">
              <Review
              id={elem._id} 
              name={elem.name} 
              description={elem.description} 
              rating={elem.rating}>
              </Review>
              </div>
            )
              }
          }) : (<p>No reviews found.</p>)
        }
        </div>
        {popUp && (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          
          {/* Modal Container */}
          <div className="group relative aspect-[4/3] w-[min(30vw,1000px)] max-w-md p-6 bg-white rounded-lg shadow-xl flex justify-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setPopUp(false)}
              className="absolute w-fit text-gray-500 top-3 right-3 hover:text-gray-800 font-bold cursor-pointer"
            >
              <img src={X} alt="Close" title="Close" className="aspect-[1] w-5"/>
            </button>
            <button 
              onClick={deleteReview}
              className="absolute w-fit text-gray-500 top-1 left-3 hover:text-gray-800 font-bold cursor-pointer"
            >
             <img src={Trash} alt="Delete" title="Delete" className="aspect-[1] w-8"/> 
            </button>

            <div className="flex flex-col justify-center items-center w-fit" onClick={(e) => e.stopPropagation()}>
            <h1>Edit Review</h1>
            <div className="flex justify-center" id="newRevRating">
                <img src={1 <= selectedReview.rating ? "https://i.imgur.com/X0qPEO5.png" : "https://i.imgur.com/bzDVI4C.png"} alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="1"/>
                <img src={2 <= selectedReview.rating ? "https://i.imgur.com/X0qPEO5.png" : "https://i.imgur.com/bzDVI4C.png"} alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="2"/>
                <img src={3 <= selectedReview.rating ? "https://i.imgur.com/X0qPEO5.png" : "https://i.imgur.com/bzDVI4C.png"} alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="3"/>
                <img src={4 <= selectedReview.rating ? "https://i.imgur.com/X0qPEO5.png" : "https://i.imgur.com/bzDVI4C.png"} alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="4"/>
                <img src={5 <= selectedReview.rating ? "https://i.imgur.com/X0qPEO5.png" : "https://i.imgur.com/bzDVI4C.png"} alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="5"/>
              </div>
            <form className="flex flex-col items-center w-full" onSubmit={editReview}>
              
                <textarea name="revDescription" id="" cols="20" rows="5" placeholder="Enter review here" defaultValue={selectedReview.description}></textarea>
                <input type="text" name="userName" id="userName" placeholder="Name" defaultValue={selectedReview.name} />         
                <input className="text-gray-400" type="text" name="orderID" id="orderID" disabled={true} value={selectedReview.orderID}/>     
                <input type="submit" id="submitButton"/>
                <h2 id="errorMsg">{errorMsg}</h2>
            </form>
          
          </div>
          </div>
          
        </div>
      )}
    </div>
)
}

export default ReviewHistory;