import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import styled from 'styled-components';
import { useAuth } from "../hooks/useAuth";
import L from 'leaflet'; // Ensure Leaflet is imported
import axios from 'axios'; // Ensure axios is imported
import polyline from '@mapbox/polyline'; // Import the polyline library
import { IoLocationSharp } from "react-icons/io5"; // Import the location icon
import { renderToStaticMarkup } from 'react-dom/server'; // To render the icon as SVG string
//import {login} from "./login"; // Adjust the path as needed

// Styled Components
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f0f0f0;
    min-height: 100vh;
    padding: 20px;
`;

const Header = styled.h1`
    font-size: 40px;
    color: #007f5c;
`;

const PathContainer = styled.div`
    margin: 20px;
    text-align: left;
    background: #ffffff;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 95%;
`;

const AttractionItem = styled.div`
    font-size: 24px;
    margin: 15px 0;
    color: #333;
    display: flex;
    align-items: center;
`;

const Distance = styled.h3`
    font-size: 30px;
    margin: 5px 0;
    color: #007f5c;
`;

const MapContainerStyled = styled(MapContainer)`
    height: 400px;
    width: 97%;
    border: 3px solid #007f5c;
    border-radius: 8px;
`;

// Convert IoLocationSharp to an SVG string for the marker icon
const createCustomIcon = () => {
    const iconMarkup = renderToStaticMarkup(<IoLocationSharp size={32} color="#007f5c" />);
    return L.divIcon({
        html: iconMarkup,
        className: '', // Remove the default leaflet class for custom styling
        iconAnchor: [16, 32], // Adjust icon anchor based on size
        popupAnchor: [0, -32],
    });
};

const ShortestPath = () => {
    const { user } = useAuth();
    const location = useLocation();
    const { path = [], totalDistance = 0 } = location.state || {};
    const [markerPositions, setMarkerPositions] = useState([]);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login",{replace:true}); // Redirect to login if user is not authenticated
        }
    }, [user, navigate]);

    const fetchRoute = async (coordinates) => {
      const waypoints = coordinates.map(coord => coord.join(',')).join(';');
      const url = `http://router.project-osrm.org/route/v1/driving/${waypoints}?overview=full`;
  
      console.log("Requesting route with waypoints:", waypoints);
  
      try {
          const response = await axios.get(url);
          console.log("API Response:", response.data);
  
          if (response.data && response.data.routes && response.data.routes.length > 0) {
              const route = response.data.routes[0];
              console.log("Route Data:", route);
  
              if (route.distance > 0 && route.duration > 0) {
                  const routePolyline = route.geometry;
                  const decodedCoordinates = polyline.decode(routePolyline);
                  console.log("Decoded Route Coordinates:", decodedCoordinates);
                  setRouteCoordinates(decodedCoordinates.map(coord => [coord[0], coord[1]]));
              } else {
                  console.error("Received route with zero distance or duration. Check your coordinates.");
              }
          } else {
              console.error("No routes found in the response. Response:", response.data);
          }
      } catch (error) {
          console.error("Error fetching route:", error);
      }
  };
  
    useEffect(() => {
        if (path.length > 0) {
            const coordinates = path.map(attraction => [attraction.latitude, attraction.longitude]);
            console.log("Coordinates:", coordinates);
            setMarkerPositions(coordinates);

            if (coordinates.length > 1) {
                fetchRoute(coordinates);
            } else {
                console.error("Not enough coordinates to fetch a route.");
                setError("Not enough coordinates to fetch a route.");
            }
        }
    }, [path]);

    // Use map to set bounds
    const AdjustMapView = () => {
        const map = useMap();
        if (markerPositions.length > 0) {
            const bounds = L.latLngBounds(markerPositions);
            map.fitBounds(bounds);
        }
        return null;
    };

    return (
        <Container>
            <Header>Shortest Path</Header>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <PathContainer>
                <Distance>Attractions</Distance>
                {path.map((attraction, index) => (
                    <AttractionItem key={index}>
                        <IoLocationSharp style={{ marginRight: '10px', color: '#007f5c' }} /> 
                        {attraction.name}
                    </AttractionItem>
                ))}
                <Distance>Total Distance: {totalDistance} km</Distance>
            </PathContainer>
            <MapContainerStyled center={[0, 0]} zoom={10}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {markerPositions.length > 0 && markerPositions.map((position, index) => (
                    <Marker key={index} position={position} icon={createCustomIcon()} />
                ))}
                {routeCoordinates.length > 0 && <Polyline positions={routeCoordinates} color="blue" />}
                <AdjustMapView />
            </MapContainerStyled>
        </Container>
    );
};

export default ShortestPath;
