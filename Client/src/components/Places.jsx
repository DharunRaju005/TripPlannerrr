import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import WorldMap from '../assets/world.svg'; // Path to your SVG map
import { useAuth } from "../hooks/useAuth";

// Main container for the whole Places section
const PlacesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  gap: 24px;
  width: 100%;
  background-color: #F6F6F6;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  border-radius: 10px; /* Rounded corners */
`;

// Text section (title and subtitle)
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 8px;
  width: 1232px;
  text-align: center;
  margin-top: 40px;
`;

// Title styling
const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 39px;
  color: #000000;
  margin: 0;
  transition: color 0.3s ease; /* Color transition effect */

  &:hover {
    color: #00504a; /* Change color on hover */
  }
`;

// Subtitle styling
const Subtitle = styled.p`
  font-family: 'Montserrat', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #555555; /* Darker gray for better contrast */
  margin: 0;
`;

// Map container styling
const MapContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  height: auto;
  margin-top: 24px;
  border-radius: 10px; /* Rounded corners for the map */
  overflow: hidden; /* Ensures no overflow from rounded corners */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Slight shadow */
`;

// Map image styling
const MapImage = styled.img`
  width: 100%;
  height: auto;
`;

// Button styling
const Button = styled.button`
  padding: 10px 20px; /* Increased padding for better touch target */
  border: 1px solid #8DD3BB;
  border-radius: 5px;
  background-color: transparent;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px; /* Slightly larger font size */
  color: #112211;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Transition for background and scaling */

  &:hover {
    background-color: #8DD3BB; /* Background change on hover */
    color: #fff; /* Change text color on hover */
    transform: scale(1.05); /* Slight scale effect on hover */
  }
`;

// Places component
const Places = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true }); // Redirect to login if user is not authenticated
    }
  }, [user, navigate]);

  // Render the component only if the user is authenticated
  if (!user) {
    return null; // Avoid rendering anything while redirecting
  }

  return (
    <PlacesContainer>
      <TextContainer>
        <Title>Let's go places together</Title>
        <Subtitle>
          Discover the latest offers and news and start planning your next trip with us.
        </Subtitle>
      </TextContainer>

      <MapContainer>
        <MapImage src={WorldMap} alt="World Map" />
      </MapContainer>

      <Button>See All</Button>
    </PlacesContainer>
  );
};

export default Places;
