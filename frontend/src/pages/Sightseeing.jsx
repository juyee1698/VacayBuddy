import React, { useState, useEffect } from 'react';
import { fetchCityMetadata, searchSightseeing, selectSight, addReview, getItineraries } from '../apiService.js';
import { useNavigate } from 'react-router-dom';
import '../styles/Sightseeing.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Container, Row, Col, Form, FormGroup, Input, Button, Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import StarRating from './StarRating.jsx';
import AddToItineraryModal from './AddToItineraryModal.jsx';

const Sightseeing = () => {
    const [cities, setCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState({});
    const [filteredCities, setFilteredCities] = useState([]);
    const [type, setType] = useState('');
    const [results, setResults] = useState([]);
    const [searchContinuationId, setSearchContinuationId] = useState(null);
    const [modal, setModal] = useState(false);
    const [detailedInfo, setDetailedInfo] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [userReviewSummary,setUserReviewSummary] = useState('');
    const [allReviews, setAllReviews] = useState([]);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [itineraries, setItineraries] = useState([]);
    const [isAddToItineraryModalOpen, setIsAddToItineraryModalOpen] = useState(false);

    
    
    const submitReview = async () => {
        if (!detailedInfo.placeFullDetails.place_id || userReview.length < 5 || userReviewSummary.length < 5 || userReviewSummary.length > 20   || userRating === 0) {
            alert('Please make sure all fields are correctly filled out.');
            return;
        }

        const reviewData = {
            placeId: detailedInfo.placeFullDetails.place_id,
            review: userReview,
            rating: userRating,
            summary: userReviewSummary,
        };

        try {
            const revData = await addReview(reviewData);
            alert("Rating Successfully Added")
            console.log(revData)
            if (revData) {
                setUserRating(revData.rating); 
                setUserReview(revData.review); 
                setUserReviewSummary(revData.summary);
                setHasReviewed(true); 
                toggle();
            }
        } catch (error) {
            if (error.authError) {
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                console.error('Search failed:', error);
            }
        }
    };
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
      };
      

    const toggle = () => setModal(!modal);

    const navigate = useNavigate();

    const handleDetailedInfo = (data) => {
        setDetailedInfo(data);
        toggle();

        setAllReviews(data.placeReviews);
    };
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchCityMetadata();
                setCities(data.cityMetadata);
            } catch (error) {
                if (error.authError) {
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                } else {
                    console.error('Search failed:', error);
                }
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const results = cities.filter(city => city.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredCities(results);
        } else {
            setFilteredCities([]);
        }
    }, [searchTerm, cities]);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const fetchedItineraries = await getItineraries(); // Ensure this function exists and works
                setItineraries(fetchedItineraries.itineraries);
            } catch (error) {
                console.error('Error fetching itineraries:', error);
            }
        };
    
        fetchItineraries();
    }, []);
    

    const handleAddToItinerary = () => {
        if(!(itineraries.length>0)){
            alert("Please Create an Itinerary first")
        }else{
            setIsAddToItineraryModalOpen(!isAddToItineraryModalOpen);
        }
    };
    

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
        const cityName = event.target.value.split(',')[0].trim();
        const matchedCity = cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());
        if (matchedCity) {
            setSelectedCity(matchedCity);
        } else {
            setSelectedCity({});
        }
    };

    const handleTypeChange = event => {
        setType(event.target.value);
    };
const handleOpenRecommendationClick = async (placeId) =>{
        const params = {
            placeId: placeId
        };
        try {
            const sightData = await selectSight(params);
            console.log('Response from selectSight:', sightData);
            handleDetailedInfo(sightData)
            checkUserReview(sightData);
        } catch (error) {
            if (error.authError) {
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                console.error('Error sending data to selectSight:', error);
            }
        }        
    }
    const handleOpenClick = async (placeId) => {
        const params = {
            searchContinuationId: searchContinuationId, 
            placeId: placeId
        };
        try {
            const sightData = await selectSight(params);
            console.log('Response from selectSight:', sightData);
            handleDetailedInfo(sightData)
            checkUserReview(sightData);
        } catch (error) {
            if (error.authError) {
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else {
                console.error('Error sending data to selectSight:', error);
            }
        }
    };

    const checkUserReview = (sightData) => {
        if (sightData.userRating && sightData.userReview) {
            setUserRating(sightData.userRating.rating);
            setUserReview(sightData.userReview.review);
            setUserReviewSummary(sightData.userReview.summary);
            setHasReviewed(true);
        } else {
            
            setUserRating(0);
            setUserReview('');
            setUserReviewSummary('');
            setHasReviewed(false);
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedCity.name) {
            const searchParams = {
                city: selectedCity.name,
                countryCode: selectedCity.countryCode,
                country: selectedCity.country,
                iataCode: selectedCity.iataCode,
                type: type
            };
            try {
                const data = await searchSightseeing(searchParams);
                if (data) {
                    console.log(data.sightsSearchResults)
                    setResults(data.sightsSearchResults);
                    setSearchContinuationId(data.searchContinuationId)
                }
            } catch (error) {
                if (error.authError) {
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                } else {
                    console.error('Error fetching sightseeing data:', error);
                }
            }
        }
    };

    return (
        <><Container>
            <Form onSubmit={handleSubmit} className="mb-4">
                <FormGroup>
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search for cities"
                        list="city-list" />
                    <datalist id="city-list">
                        {filteredCities.map(city => (
                            <option key={city._id} value={`${city.name}, ${city.country}, ${city.countryCode}, ${city.iataCode}`} />
                        ))}
                    </datalist>
                </FormGroup>
                <FormGroup>
                    <Input type="select" value={type} onChange={handleTypeChange} className="form-control">
                        <option value="">Select Type</option>
                        <option value="tourist_attraction">Tourist Attraction</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="shopping_mall">Shopping Mall</option>
                        <option value="night_club">Night Club</option>
                    </Input>
                </FormGroup>
                <Button color="primary" type="submit">Search</Button>
            </Form>
            <Row>
                {results.map(sight => (
                    <Col sm="6" md="4" lg="3" key={sight.place_id} className="mb-4">
                        <Card className="h-100">
                            <CardImg top src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=${sight.photos[0].photo_reference}&key=${process.env.REACT_APP_PLACES_NEARBY}`} alt={sight.name} className="tour__img" />
                            <CardBody>
                                <CardTitle tag="h5" className="tour__title">{sight.name}</CardTitle>
                                <CardText className="tour__location">{sight.vicinity}</CardText>
                                <CardText className="tour__rating">Rating: {sight.rating} ({sight.user_ratings_total} reviews)</CardText>
                                <Button className="booking__btn" color="secondary" onClick={() => handleOpenClick(sight.place_id)}>Open</Button>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container><Modal isOpen={modal} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>Detailed Sight Information</ModalHeader>
                <ModalBody>
        {detailedInfo && (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                        src={detailedInfo.placeFullDetails.icon}
                        alt="Place icon"
                        style={{
                            backgroundColor: detailedInfo.placeFullDetails.icon_background_color,
                            height: '30px',
                            width: '30px'  
                        }}
                    />
                    <h4>{detailedInfo.placeFullDetails.name}</h4>
                </div>

                <p><strong>Address:</strong> {detailedInfo.placeFullDetails.formatted_address}</p>
                <p><strong>Status:</strong> {detailedInfo.placeFullDetails.business_status}</p>
                <p><strong>Rating:</strong> {detailedInfo.placeFullDetails.rating} ({detailedInfo.placeFullDetails.user_ratings_total} reviews)</p>
                {detailedInfo.placeFullDetails.opening_hours && <p><strong>Open Now:</strong> {detailedInfo.placeFullDetails.opening_hours.open_now ? 'Yes' : 'No'}</p>}
                <div>
                    <h5>Photos:</h5>
                    <Slider {...settings}>
                        {detailedInfo.placeFullDetails.additionalPhotos.map((photo, index) => (
                            <div key={index}>
                                <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${photo.photo_reference}&key=${process.env.REACT_APP_PLACES_NEARBY}`} alt="Place" />
                            </div>
                        ))}
                    </Slider>
                </div>
                <div>
                <h5>Reviews:</h5>
                {allReviews.length > 0 ? (
                    allReviews.map((allReviews) => (
                        <div key={allReviews.id} className="review-card">
                            <p><strong>Anonymous:</strong> <StarRating count={5} rating={allReviews.rating}/></p>
                            <p><strong>Summary:</strong> {allReviews.summary}</p>
                            <p>{allReviews.review}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>
            {!hasReviewed && (
                <div>
                    <h5>Rate this place:</h5>
                    <StarRating count={5} rating={userRating} onRating={value => setUserRating(value)} />
                    <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Summary of the review..."
                        value={userReviewSummary}
                        onChange={e => setUserReviewSummary(e.target.value)}
                    />
                    <textarea
                        className="form-control mt-2"
                        rows="3"
                        placeholder="Write your review..."
                        value={userReview}
                        onChange={e => setUserReview(e.target.value)}
                    />
                    <button onClick={submitReview} className="btn btn-primary mt-2 booking__btn">Submit Rating and Review</button>
                </div>
            )}
                <p><strong>More Info:</strong> <a href={detailedInfo.placeFullDetails.url} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>
                <ModalFooter>
                    <Button color="primary" class="booking__btn" onClick={handleAddToItinerary}>Add to Itinerary</Button>
                    <Button color="primary" class="booking__btn" onClick={toggle}>Close</Button>
                </ModalFooter>
                <Container>
            <h2>You might also like</h2>
            <Row>
                {detailedInfo.recommendation.map(place => (
                    <Col sm="6" md="6" lg="4" key={place.place_id} className="mb-4">
                        <Card>
                            <CardBody>
                            <CardImg top src={`https://maps.googleapis.com/maps/api/place/photo?maxheight=200&photoreference=${place.photos[0].photo_reference}&key=${process.env.REACT_APP_PLACES_NEARBY}`} alt={place.name} className="tour__img" />   
                            <CardTitle tag="h5" className="tour__title">{place.name}</CardTitle>
                                <CardText className="tour__location">{place.vicinity}</CardText>
                                <CardText className="tour__rating">Rating: {place.rating} ({place.user_ratings_total} reviews)</CardText>
                                <Button className="booking__btn" color="secondary" onClick={() => handleOpenRecommendationClick(place.place_id)}>Open</Button>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </div>
    )}
</ModalBody>
            </Modal>
            {detailedInfo && itineraries.length > 0 && (
            <AddToItineraryModal
                isOpen={isAddToItineraryModalOpen}
                toggle={handleAddToItinerary}
                detailedInfo={detailedInfo}
                itineraries={itineraries}
            />
        )}</>
    
    );
};

export default Sightseeing;
