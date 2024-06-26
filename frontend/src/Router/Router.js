import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import Home from '../pages/Home';
import ToursDetails from '../pages/TourDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import SearchResultList from '../pages/SearchResultList';
import Flights from '../pages/Flights';
import BookingCheckout from '../pages/BookingCheckout';
import BookingSuccess from '../pages/BookingSuccess';
import BookingCancel from '../pages/BookingCancel';
import BookingHistory from '../pages/BookingHistory';
import Itinerary from '../pages/Itinerary';

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<Navigate to='home'/>}/>
            <Route path='/home' element={<Home/>}/>
            <Route path='/flights' element={<Flights/>}/>
            <Route path='/tours/:id' element={<ToursDetails/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/flights/search' element={<SearchResultList/>}/>
            <Route path="/bookingCheckout" element={<BookingCheckout/>} />
            <Route path="/bookingConfirmation" element={<BookingSuccess/>}/>
            <Route path="/bookingCancel" element={<BookingCancel/>}/>
            <Route path="/bookingHistory" element={<BookingHistory/>}/>
            <Route path="/itinerary" element={<Itinerary/>}/>
        </Routes>
    )
}

export default Router;