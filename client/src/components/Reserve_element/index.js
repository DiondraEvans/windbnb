import './index.css';
import axios from 'axios';
import React, { useEffect, useState, useContext  } from 'react';
import { AppContext } from '../../contexts/app_context';
import { Link, useNavigate } from 'react-router-dom';
function GetReservedTrip(props) {
    const navigate = useNavigate();
    const {accomodation} = props
    let { tripName, names, date, summary, emails, setAccomodation, setName, setDate, setSummary, setemails, setnames, user } = useContext(AppContext);
    let id = accomodation._id
    let price = accomodation.price
    let userId = user._id
    console.log(userId)
    console.log(tripName)
    console.log(accomodation._id)
    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log("submitting!");
        const trip = {
        tripName,
        names,
        date,
        summary,
        emails,
        id,
        price,
        userId
        }
        const makePost = async () => {
            try {
                let serverResponse = await axios({
                    method: 'POST',
                    url: "https://wind-bnb-website-api.vercel.app/create_trip",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: JSON.stringify(trip)
                });
                console.log(serverResponse)
            } catch (error) {
                console.error(error);
            }
        };
        makePost();
        //reset values here:
        setName("")
        setDate("")
        setSummary("")
        navigate('https://wind-bnb-website.vercel.app/activetrips');
    }
  return (
    <div className="ReservedTripBox">
    <h3>Total price:</h3>
    <p> ${accomodation.price}</p>
    {user ? <button className="res-btn" onClick={(event) => handleSubmit(event)}>Reserve</button> : "Log in to reserve"}
    </div>
  );
}

export default GetReservedTrip;