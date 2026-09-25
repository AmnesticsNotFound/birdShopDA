import { useState } from 'react';
import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {useCookies} from 'react-cookie';
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import axios from 'axios';
import urlPrefix from '../client'; // Import your helper
import Review from './Review.jsx';

import '/public/style/Testimonials.css';



function Testimonials(props) {

    const [reviews, setReviews] = useState([]);
    const [errorMsg, setErrorMsg] = useState(" ");
    const [popUp, setPopUp] = useState(false);
    const { user, setUser } = useOutletContext();
    const [userReviews, setUserReviews] = useState([]);
    let newReviewRating;
    useEffect( () => {
        async function getReviews() {
          let res = await urlPrefix.get('/getReviews');
          
          setReviews(res.data);
          //console.log(catalog);
        }
        //console.log(user)
        getReviews();
    
        
      }, [])

      useEffect(() => {
        
        async function getOrderHistory() {
          let res = await axios.post('http://localhost:8080/getOrderHistory', {idOnly:true});
          setUserReviews(res.data);
          console.log(res.data)
        }
        getOrderHistory();
        
      }, [user])

      async function postReview(e) {
        //
        
        e.preventDefault();
        let errorElem = document.querySelector('#errorMsg');

        let ratingElem = document.querySelector('#revRating');
        let descriptionElem = e.target.description;
        let nameElem = e.target.name;

        ratingElem.style.border = '';
        descriptionElem.style.border = '';
        nameElem.style.border = '';
        errorElem.innerText = '';

        if (newReviewRating == undefined) {
          
          ratingElem.style.border = '2px solid red';
          errorElem.innerText = errorElem.innerText + "* Select Star Rating\n";
          
          
        }
         if (e.target.description.value.length < 10) {
          errorElem = document.querySelector('#errorMsg');
          descriptionElem.style.border = '2px solid red';
          errorElem.innerText = errorElem.innerText + "* Description must be at least 10 characters\n";
          
          
        }
         if (e.target.name.value.length === 0) {
           errorElem = document.querySelector('#errorMsg');
          
          nameElem.style.border = '2px solid red';
          errorElem.innerText = errorElem.innerText + "* Missing Name\n";
          
          
        }
        else {
          
          /*const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(e.target.orderID.value);

          if (!isValidObjectId) {
            console.error("Invalid Order ID or review already exists");
            // Update your UI to show an error message
            let errorElem = document.querySelector('#errorMsg');
            errorElem.innerText = "* Invalid Order ID";
            return; 
          }*/

          // 2. Reactive: Handle the Axios request and catch server errors
          try {
            const response = await axios.post('http://localhost:8080/postReview', { 
              name:e.target.name.value,
              description: e.target.description.value,
              rating:newReviewRating,
            });
            
            // Axios automatically parses JSON, so you can access data directly
            console.log("Success:", response.data);
            //setReviews(res.data) FIXXXX
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

      function saveRating(e) {
        let starGroup = document.querySelector('#revRating');
        starGroup = starGroup.children;
        newReviewRating = e.target.getAttribute('value');
        // set selected stars to yellow
        for(let i = newReviewRating; i < 5; ++i) {
          starGroup[i].src = 'https://i.imgur.com/bzDVI4C.png';
        }
        console.log(newReviewRating);
      }

      function starEnter(e) {
        let starGroup = document.querySelector('#revRating');
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
        let starGroup = document.querySelector('#revRating');
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

    return (
        <div className="flex flex-col justify-center items-center w-full justify-self-center" >
          {/* 3. Conditional rendering for the modal */}
      {popUp && (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          
          {/* Modal Container */}
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl flex justify-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setPopUp(false)}
              className="absolute text-gray-500 top-3 right-4 hover:text-gray-800 font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col justify-center items-center w-fit gap-1" >
            <h1>Write a Review</h1>
            <div className="flex justify-center" name="revRating"id="revRating">
                <img src="https://i.imgur.com/bzDVI4C.png" alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="1"/>
                <img src="https://i.imgur.com/bzDVI4C.png" alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="2"/>
                <img src="https://i.imgur.com/bzDVI4C.png" alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="3"/>
                <img src="https://i.imgur.com/bzDVI4C.png" alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="4"/>
                <img src="https://i.imgur.com/bzDVI4C.png" alt="" name="reviewStar" className="newRevStars" onMouseOver={starEnter} onMouseLeave={starLeave} onClick={saveRating} value="5"/>
              </div>
              


                <div className="">
                  
                  
                 
                 {/* <p >Select Parrot:</p>
                  <div className="relative group w-max" >
                    <div className="bg-[#f0f0f0] border-2 rounded-[3px] pl-1 pr-1" defaultValue={userReviews[0]}></div>
                    <div className="absolute top-full left-0 w-full bg-[#ffffff] hidden group-hover:flex flex-col rounded-b-md shadow-md overflow-hidden z-50 border-t border-gray-100">
                  {
                    userReviews.map((elem, index) => {
                      console.log(elem)
                      return (
                        <div key={index} className="px-4 py-2 text-[min(0.8vw,16px)] text-left hover:bg-gray-100 transition-colors cursor-pointer"
                        >{elem}</div>
                      )
                    })
                  }         
                </div>

                  </div>
                    */}
                </div>
                
              
            <form className="flex flex-col items-center w-full" onSubmit={postReview}>
                 
                <textarea name="description" id="description" cols="20" rows="5" placeholder="Enter review here"></textarea>
                <input type="text" name="name" id="name" placeholder="Name" />         
                {/*<input type="text" name="orderID" id="orderID" placeholder="Order ID" />*/}    
                <input type="submit" id="submitButton"/>
                <h2 id="errorMsg">{errorMsg}</h2>
            </form>
          
          </div>
          </div>
          
        </div>
        
      )}
            <div className="flex flex-col justify-center items-center" onClick={(e) => e.stopPropagation()}>
              <h1 id="testimonialTitle">Testimonials</h1>
              <div className="flex gap-5">
                <button 
                  onClick={() => setPopUp(true)}
                  className="bg-[rgb(235,233,224)] aspect-[21/9] text-[1rem] w-[min(7.5vw,288px)] cursor-pointer border-4"
                >
                  Create Review
                </button>
                <Link to="/user/reviews">
                <button className="bg-[rgb(235,233,224)] aspect-[21/9] text-[1rem] w-[min(7.5vw,288px)] cursor-pointer border-4">Your Reviews</button>
                </Link>
              </div>
            </div>
          <div className="grid grid-cols-[repeat(3,min(25vw,600px))] w-[80vw] justify-center items-center">
          {
            reviews.map((elem, index)=> {
                
              return (

                <Review key={elem._id} 
                id={elem._id} 
                name={elem.name} 
                description={elem.description} 
                rating={elem.rating}
                parrots={elem.parrots}>
                </Review>

              )
            })
          }


  

          </div>
        </div>
    )
}
export default Testimonials;