import { useState, useEffect} from 'react';
import { useRef } from 'react';
import {useCookies} from 'react-cookie';
import React from "react";
import { useParams } from "react-router-dom";
import '/public/style/Faq.css';

function Faq() {
return  (
    <div className="flex flex-col gap-7 pl-3">
        
        <h1 className="question">How long have you been in business?</h1>
        <p className="indent">Started in 2005. It was just a hobby at first,
            but now it is about half my income and hopefully it will overtake
             my fulltime job sooner rather than later.
        </p>
        
        
        <h1 className="question">What is the shipping time?</h1>
        <p className="indent">Well, that depends on where you are and the state of your bird.
            Assuming the bird is weaned and ready to go, it ranges from a few
            hours to about half a day. We only ship out birds once a month, on the second Wednesday.
             The parrots are shipped using Delta
            Cargo and may arrive overnight.
        </p>
        <p className="indent text-[red]">WE ONLY SHIP TO THE CONTINENTAL US!</p>
        
        <h1 className="question">Do you share family history?</h1>
        <p className="indent">Yes, at your request we can disclose the bloodline history of a
            parrot you are interested in purchasing. We ensure that all of our
            species are healthy and have the reputation as well as documentation
            to back it up.
        </p>
        
        <h1 className="question">What is your refund policy?</h1>
        <p className="indent">As said before, we are confident in the health of out parrots and due thorough testing. However, 
            in the event that something is seriously wrong with your avian companion, we will issue a refund. If you notice 
            some health complication at a veterinarian, do not hesitate to contact us. Have your vet send us lab results.
            At this point you may opt to keep or return the bird. 
            
        </p>
        
        <p className="indent">This policy does <strong>not</strong> apply to
        the following cases:</p>
        <ul className="indent">
            <li><strong>Slight amount of bacteria</strong> -this is normal and is caused by the stress of transport</li>
            <li><strong>Cold/Flu/etc.</strong> -This is the responsibility of Delta, we have instructed them on the optimal
                temperature and transport for avians. Sometimes they do not listen, any issues are to to 
                be taken up with them.</li>
        </ul>
        
        <h1 className="question">How can I contact you?</h1>

        <div id="email">
            <p className="indent"><strong>Email:</strong> avianavenue1983@gmail.com</p>
        </div>
        <div id="phone">
            <p className="indent"><strong>Phone:</strong> +1 (210) 333-4657</p>
        </div>
    </div>
)
}
export default Faq;