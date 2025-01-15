// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Import the map marker icon
import rest from '../assets/history.webp'; 
import sside from '../assets/seaside.jpg'; // Placeholder image for attractions
import { useAuth } from '../hooks/useAuth'; // Import the useAuth hook

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #e4f5f1, #d9e6f2); /* Soft gradient */
    min-height: 100vh;
    padding: 40px 20px;
`;

const Header = styled.h1`
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 40px;
    color: #333;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 2px;
    border-bottom: 2px solid #8dd3bb;
    padding-bottom: 10px;
    width: fit-content;
`;

const AttractionContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 30px;
    margin: 20px 0;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* Deeper shadow for better effect */
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-10px);
    }
`;

const AttractionImage = styled.img`
    width: 85%;
    height: 400px;
    border-radius: 15px;
    object-fit: cover;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px; 
`;

const AttractionDetails = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`;

const AttractionDescription = styled.p`
    font-size: 20px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 20px;
`;

const WeatherInfo = styled.div`
    font-size: 18px;
    font-weight: 500;
    color: #006d5b;
    padding: 10px;
    background: #f0f8f7;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const CoordinatesInfo = styled.div`
    font-size: 18px;
    font-weight: 500;
    color: #333;
    background: #f9f9f9;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between; /* Push the icon to the right */
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
`;

const MapIcon = styled(FaMapMarkerAlt)`
    color: #006d5b;
    cursor: pointer;
    font-size: 36px; /* Increase the size of the icon */
    margin-left: 15px;
    transition: color 0.3s ease;

    &:hover {
        color: #004c40;
    }
`;

const RestaurantList = styled.div`
    display: flex; /* Use flexbox for layout */
    flex-wrap: wrap; /* Allow wrapping on smaller screens */
    justify-content: flex-start; /* Align items to the left */
    width: 100%;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 2px solid #8dd3bb;
`;

const RestaurantItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Align items to the left */
    margin: 10px; /* Reduced margin for spacing */
    padding: 15px;
    background-color: #fff;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    width: calc(21% - 17px); /* Set width to approximately 23% to fit four cards in a row */
    cursor: pointer; /* Make it clear that the item is clickable */

    &:hover {
        transform: translateY(-10px);
    }

    strong {
        font-size: 18px;
        color: #333;
        text-align: left; /* Left-align text */
    }

    p {
        margin: 5px 0;
        font-size: 14px;
        color: #555;
        text-align: left; /* Left-align text */
    }

    img {
        width: 92%; /* Adjust the size of the image */
        border-radius: 10px; /* Rounded corners */
        margin: 10px;
        object-fit: cover;
        margin-bottom: 10px; /* Space between image and text */
    }
`;

const NearbyRestaurantsHeader = styled.h3`
    width: 100%; /* Full width for proper alignment */
    margin: 0; /* Remove default margin */
    font-size: 24px; /* Font size for the heading */
    font-weight: bold; /* Make it bold */
    color: #333; /* Text color */
    border-bottom: 2px solid #8dd3bb; /* Bottom border */
    padding-bottom: 10px; /* Padding below the heading */
    text-align: left; /* Align text to the left */
`;

const AttractionDescriptionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get authentication status
    const { attraction, restaurants } = location.state || {};

    // Redirect to login if the user is not authenticated
    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true }); // Redirect to login page
        }
    }, [user, navigate]);

    if (!user) {
        return null; // Prevent rendering while redirecting
    }

    if (!attraction) {
        return <div>No attraction data found.</div>;
    }

    const handleMapClick = () => {
        const googleMapsUrl = `https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`;
        window.open(googleMapsUrl, '_blank');
    };

    const handleRestaurantClick = (latitude, longitude) => {
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(googleMapsUrl, '_blank');
    };

    return (
        <Container>
            <Header>{attraction.name}</Header>
            <AttractionImage src={sside} alt={attraction.name} />
            <AttractionContainer>
                <AttractionDetails>
                    <AttractionDescription>
                        {attraction.description}
                    </AttractionDescription>
                    <WeatherInfo>
                        Best Climate: {attraction.best_climate}<br />
                        Ideal Weather: {attraction.ideal_weather} <br />
                        Feels Like: {attraction.ideal_temp_min}°C
                    </WeatherInfo>
                    <CoordinatesInfo>
                        <div>
                            Latitude: {attraction.latitude} <br />
                            Longitude: {attraction.longitude}
                        </div>
                        <MapIcon onClick={handleMapClick} />
                    </CoordinatesInfo>
                </AttractionDetails>
            </AttractionContainer>

            <RestaurantList>
                <NearbyRestaurantsHeader>Nearby Restaurants:</NearbyRestaurantsHeader>
                {restaurants && restaurants.slice(0, 4).map((restaurant, index) => (
                    <RestaurantItem 
                        key={index} 
                        onClick={() => handleRestaurantClick(restaurant.latitude, restaurant.longitude)}
                    >
                        <img src={rest} alt={restaurant.name} />
                        <div>
                            <strong>{restaurant.name}</strong>
                            <p>Address: {restaurant.address}</p>
                            <p>Rating: {restaurant.rating}</p>
                            <p>Distance: {restaurant.distance.toFixed(2)} km</p>
                        </div>
                    </RestaurantItem>
                ))}
            </RestaurantList>
        </Container>
    );
};

export default AttractionDescriptionPage;
