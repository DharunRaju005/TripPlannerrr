// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaMapMarkerAlt } from 'react-icons/fa';
import rest from '../assets/history.webp';
import sside from '../assets/seaside.jpg';
import { useAuth } from '../hooks/useAuth'; // Import the useAuth hook

// Styled Components with mobile optimizations
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e4f5f1, #d9e6f2);
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 20px 10px; /* Reduced padding */
  }
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
  @media (max-width: 768px) {
    font-size: 28px; /* Smaller header */
    margin-bottom: 20px;
  }
`;

const AttractionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 30px;
  margin: 20px 0;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  @media (max-width: 768px) {
    width: 90%; /* Wider on mobile */
    padding: 15px;
    margin: 10px 0;
  }
`;

const AttractionImage = styled.img`
  width: 85%;
  height: 400px;
  border-radius: 15px;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  @media (max-width: 768px) {
    width: 100%; /* Full width */
    height: 200px; /* Smaller height */
    margin-bottom: 15px;
  }
`;

const AttractionDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const AttractionDescription = styled.p`
  font-size: 20px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 16px; /* Smaller text */
    margin-bottom: 15px;
  }
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
  @media (max-width: 768px) {
    font-size: 14px; /* Smaller text */
    padding: 8px;
    margin-bottom: 15px;
  }
`;

const CoordinatesInfo = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  background: #f9f9f9;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 14px; /* Smaller text */
    padding: 8px;
    margin-bottom: 15px;
  }
`;

const MapIcon = styled(FaMapMarkerAlt)`
  color: #006d5b;
  cursor: pointer;
  font-size: 36px;
  margin-left: 15px;
  transition: color 0.3s ease;

  &:hover {
    color: #004c40;
  }

  @media (max-width: 768px) {
    font-size: 24px; /* Smaller icon */
    margin-left: 10px;
  }
`;

const RestaurantList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 80%;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #8dd3bb;
  @media (max-width: 768px) {
    width: 90%; /* Wider on mobile */
    margin-top: 20px;
    padding-top: 15px;
    justify-content: center; /* Center items on mobile */
  }
`;

const RestaurantItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 10px;
  padding: 15px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: calc(21% - 17px); /* Four items per row on desktop */
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
  }

  strong {
    font-size: 18px;
    color: #333;
    text-align: left;
  }

  p {
    margin: 5px 0;
    font-size: 14px;
    color: #555;
    text-align: left;
  }

  img {
    width: 92%;
    border-radius: 10px;
    margin: 10px;
    object-fit: cover;
    margin-bottom: 10px;
  }

  @media (max-width: 768px) {
    width: calc(100% - 20px); /* Full width minus margin */
    margin: 5px 0;
    padding: 10px;

    strong {
      font-size: 16px; /* Smaller title */
    }

    p {
      font-size: 12px; /* Smaller text */
    }

    img {
      width: 100%; /* Full width */
      margin: 5px 0;
    }
  }
`;

const NearbyRestaurantsHeader = styled.h3`
  width: 100%;
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #8dd3bb;
  padding-bottom: 10px;
  text-align: left;
  @media (max-width: 768px) {
    font-size: 20px; /* Smaller header */
    padding-bottom: 8px;
  }
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