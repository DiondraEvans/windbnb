import './index.css';
import axios from 'axios';
import React, { useEffect, useState, useContext  } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Picturegrid from "../../components/picture_grid"
import SearchBar from '../../components/search-bar';
import ReservedTripBox from '../../components/Reserve_element';
import AboutCard from '../../components/about_card';
import Nav from '../../components/nav';
import { AppContext } from '../../contexts/app_context';


function GetSingleData() {
  let { accomodation, setAccomodation, tripName } = useContext(AppContext);
 
  const { id } = useParams();
  console.log(id)
  useEffect(() => {
    const makeServerCall = async () => {
    let serverResponse = await axios({
        method: 'GET',
        url: `https://wind-bnb-website-api.vercel.app/single/${id}`
    });
    console.log(serverResponse.data)
    let data = serverResponse.data
    setAccomodation(data)
  }
  makeServerCall();
  }, []);
 
  return (
    <div>
      <Nav />
      <div className="single_page">
      {tripName ? <h2>Step 3: Reserve your accomodation for your trip: <h2 style={{color: "#38B7FF", textAlign: "center"}}>{tripName}</h2></h2> : ""}
        <SearchBar/>
        <Picturegrid accomodation={accomodation} />
      
        <div className='single_section_two'>
          <AboutCard accomodation={accomodation}/>
          <ReservedTripBox accomodation={accomodation}/>
      
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default GetSingleData;