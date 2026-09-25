import { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from 'axios';
import Card from './Card.jsx';
import '/public/style/Shop.css';
import urlPrefix from '../client'; // Import your helper
//import Catalog from '../data/Catalog.js';

function Shop() {
  const [catalog, setCatalog] = useState([]);
  const { category } = useParams();
console.log(category);
 

  useEffect( () => {
    async function getCatalog() {
      //let res = await axios.get('https://birdshop-fullstack.onrender.com/getCatalog');
      
      let res = await urlPrefix.get(`/get${category}`); // Use the helper function
      setCatalog(res.data);
      //console.log(catalog);
    }
    getCatalog();
    


  }, [category])

  
  return (
    
        <div id="main">
          {category == "parrots" &&(
          <>
          <h1>Parrots</h1>
          <div className="cards">
            {
          catalog.map((elem, index)=> {
            if(elem.category == "Parrot")  {
            return (
              <Card key={elem.key} product={elem}></Card>
            )
          }
          })}
          </div> 
          </> )
}
          
          {category == "products" && (
          <>
          <h1>Food</h1>
          <div className="cards">
            {
          catalog.map((elem, index)=> {
            if(elem.category == "Food")  {
            return (
              <Card key={elem.key} product={elem}></Card>
            )
          }
          })}
          </div> 
          </> )
}

          {category == "products" && (
                    <>
                    <h1>Accessories</h1>
                    <div className="cards">
                      {
                    catalog.map((elem, index)=> {
                      if(elem.category == "Accessory")  {
                      return (
                        <Card key={elem.key} product={elem}></Card>
                      )
                    }
                    })}
                    </div> 
                    </> )
          }
          </div>
  )
}

export default Shop
