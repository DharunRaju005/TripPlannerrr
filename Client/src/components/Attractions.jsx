import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import sside from '../assets/seaside.jpg';

import { useAuth } from "../hooks/useAuth";
// Skeleton keyframes
const shimmer = keyframes`
  0% { background-position: -100%; }
  100% { background-position: 100%; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e4f5f1, #d9e6f2);
  min-height: 100vh;
  padding: 40px 20px;
  box-sizing: border-box;
  @media (max-width: 768px) { padding: 20px 10px; }
`;

const Header = styled.h1`
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 32px;
  text-align: center;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 80%;
  @media (max-width: 768px) {
    font-size: 28px;
    margin-bottom: 20px;
    width: 90%;
  }
`;

const Day = styled.h2`
  font-size: 32px;
  color: #006d5b;
  margin: 20px 0;
  text-align: left;
  width: 80%;
  @media (max-width: 768px) {
    font-size: 22px;
    margin: 15px 0;
    width: 90%;
  }
`;

const DayHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const AllAttractions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const AttractionContainer = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  padding: 20px;
  margin: 10px 0;
  background-color: ${props => props.selected ? '#f0f7f5' : 'white'};
  border: ${props => props.selected ? '2px solid #006d5b' : 'none'};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    background-color: #f8fbfc;
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AttractionImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  margin-right: 20px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    width: 100%;
    height: 120px;
    margin-right: 0;
    margin-bottom: 10px;
  }
`;

const AttractionDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AttractionName = styled.h2`
  font-size: 26px;
  font-weight: bold;
  color: #8dd3bb;
  margin-bottom: 5px;
  transition: color 0.3s ease;

  ${AttractionContainer}:hover & {
    color: #006d5b;
  }

  @media (max-width: 768px) { font-size: 20px; }
`;

const AttractionDescription = styled.p`
  font-size: 18px;
  color: #555;
  margin-top: 5px;
  @media (max-width: 768px) { font-size: 14px; }
`;

const CalculateButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 30px;
  font-size: 20px;
  color: white;
  background-color: #006d5b;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: ${props => props.visible ? 'auto' : 'none'};

  &:hover {
    background-color: #00504a;
    transform: translateX(-50%) scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 16px;
    bottom: 10px;
  }
`;

const ClearCacheButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #006d5b;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #00504a;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 14px;
    top: 10px;
    left: 10px;
  }
`;

const SkeletonLoader = styled.div`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '100%'};
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${props => props.borderRadius || '4px'};
`;

const SkeletonAttraction = () => (
  <AttractionContainer>
    <SkeletonLoader width="150px" height="150px" borderRadius="10px" style={{ margin: '10px' }} />
    <AttractionDetails>
      <SkeletonLoader width="60%" height="26px" />
      <SkeletonLoader width="80%" height="18px" style={{ marginTop: '10px' }} />
    </AttractionDetails>
  </AttractionContainer>
);

// Function to determine base URL
const getBaseUrl = async () => {
  try {
    // Test localhost connection with a small timeout
    await axios.get('http://localhost:7000/ping', { timeout: 1000 });
    return 'http://localhost:7000';
  } catch (error) {
    // Fallback to production if localhost fails or times out
    return 'https://tripplannerbe.onrender.com';
  }
};

const AttractionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { destination, startDate, totalDays } = location.state || {};
  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAttractions, setSelectedAttractions] = useState([]);
  const [baseUrl, setBaseUrl] = useState(null);

  useEffect(() => {
    // Determine the base URL when component mounts
    getBaseUrl().then(url => {
      setBaseUrl(url);
    });
  }, []);

    const { user } = useAuth(); // Check the logged-in user
    useEffect(() => {
        // Redirect to login if user is not authenticated
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

  useEffect(() => {
    if (!destination || !startDate || !totalDays || !baseUrl) {
      if (!destination || !startDate || !totalDays) {
        console.error("Destination, start date or total days is missing.");
      }
      return;
    }

    const cacheKey = `attractions_${destination}_${startDate}_${totalDays}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      console.log("Using cached attractions data.");
      setAttractions(JSON.parse(cachedData));
      setIsLoading(false);
    } else {
      console.log("Fetching attractions from API...");
      fetchAttractions(cacheKey);
    }
  }, [destination, startDate, totalDays, baseUrl]);

  const fetchAttractions = async (cacheKey) => {
    try {
      const response = await axios.get(`${baseUrl}/attraction/getAttraction`, {
        params: { destination, days: totalDays, date: startDate },
        withCredentials: true,
      });

      const groupedAttractions = response.data.map((dayData) => ({
        day: `Day ${dayData.day}`,
        attractions: dayData.suggestions.flatMap(suggestion =>
          suggestion.attractions.map(a => ({
            id: a.attraction.id,
            name: a.attraction.name,
            description: a.attraction.description,
            category: a.attraction.category,
            latitude: a.attraction.latitude,
            longitude: a.attraction.longitude,
            best_climate: a.attraction.best_climate,
            ideal_temp_min: a.attraction.ideal_temp_min,
            ideal_temp_max: a.attraction.ideal_temp_max,
            ideal_weather: a.attraction.ideal_weather,
            feels_like: dayData.feels_like,
            weather: dayData.weather,
            restaurants: a.restaurant,
          }))
        ),
      })).map(dayGroup => ({
        ...dayGroup,
        attractions: Array.from(new Set(dayGroup.attractions.map(attraction => attraction.id)))
          .map(id => dayGroup.attractions.find(attraction => attraction.id === id)),
      }));

      setAttractions(groupedAttractions);
      localStorage.setItem(cacheKey, JSON.stringify(groupedAttractions));
    } catch (error) {
      console.error("Error fetching attractions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttractionSelect = (attractionId) => {
    setSelectedAttractions(prev => {
      if (prev.includes(attractionId)) {
        return prev.filter(id => id !== attractionId);
      } else {
        return [...prev, attractionId];
      }
    });
  };

  const handleCalculatePath = () => {
    const selectedAttractionObjects = attractions
      .flatMap(dayGroup => dayGroup.attractions)
      .filter(attraction => selectedAttractions.includes(attraction.id));

    let totalDistance = 0;
    selectedAttractionObjects.forEach((attraction, index) => {
      if (index < selectedAttractionObjects.length - 1) {
        const nextAttraction = selectedAttractionObjects[index + 1];
        totalDistance += haversine(
          attraction.latitude, attraction.longitude,
          nextAttraction.latitude, nextAttraction.longitude
        );
      }
    });

    navigate('/shortest-path', { state: { path: selectedAttractionObjects, totalDistance: totalDistance.toFixed(2) } });
  };

  const handleAttractionClick = (attraction, e) => {
    if (e.target.tagName === 'H2') {
      navigate('/Attractions_Description', { state: { attraction, restaurants: attraction.restaurants || [] } });
    }
  };

  const handleClearCache = () => {
    const cacheKey = `attractions_${destination}_${startDate}_${totalDays}`;
    localStorage.removeItem(cacheKey);
    setIsLoading(true);
    fetchAttractions(cacheKey);
  };

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon1 - lon2) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <Container>
      <ClearCacheButton onClick={handleClearCache}>
        Clear Cache
      </ClearCacheButton>
      <Header>{destination} Attractions</Header>
      {isLoading || !baseUrl ? (
        Array.from({ length: 3 }).map((_, index) => <SkeletonAttraction key={index} />)
      ) : (
        attractions.map((dayGroup) => (
          <AllAttractions key={dayGroup.day}>
            <DayHeader><Day>{dayGroup.day}</Day></DayHeader>
            {dayGroup.attractions.map((attraction) => (
              <AttractionContainer
                key={attraction.id}
                selected={selectedAttractions.includes(attraction.id)}
                onClick={(e) => {
                  handleAttractionSelect(attraction.id);
                  handleAttractionClick(attraction, e);
                }}
              >
                <AttractionImage src={sside} alt={attraction.name} />
                <AttractionDetails>
                  <AttractionName>{attraction.name}</AttractionName>
                  <AttractionDescription>{attraction.description}</AttractionDescription>
                </AttractionDetails>
              </AttractionContainer>
            ))}
          </AllAttractions>
        ))
      )}
      <CalculateButton
        visible={selectedAttractions.length >= 2}
        onClick={handleCalculatePath}
      >
        Calculate Path ({selectedAttractions.length} selected)
      </CalculateButton>
    </Container>
  );
};

export default AttractionsPage;