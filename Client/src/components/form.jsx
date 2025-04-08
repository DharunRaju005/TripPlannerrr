import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import bannerImage from "../assets/seaside.jpg";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

// Keyframe animations
const fadeInSlideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const buttonHoverScale = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
`;

// Styled components with mobile optimizations
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Changed to min-height to avoid clipping */
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(${bannerImage});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 20px; /* Added padding for small screens */
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 10px; /* Reduced padding on mobile */
  }
`;

const Header = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
  }
`;

const ProfileButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px; /* Increased for touch */
  transition: color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #8dd3bb;
    transform: scale(1.05);
  }

  &:after {
    content: "";
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 0;
    height: 2px;
    background: #8dd3bb;
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 1.2rem; /* Smaller text */
    padding: 8px; /* Still touch-friendly */
  }
`;

const ProfilePopup = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 15px; /* Reduced padding */
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${fadeInSlideDown} 0.4s ease;
  width: 200px; /* Fixed width for consistency */
  max-width: 90%; /* Prevent overflow on small screens */

  &::before {
    content: "";
    position: absolute;
    top: -10px;
    right: 15px;
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.9);
    transform: rotate(45deg);
    box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    top: 40px; /* Closer to button */
    padding: 10px;
    width: 180px; /* Slightly smaller */
  }
`;

const PopupItem = styled.div`
  font-size: 1rem;
  color: #333;
  padding: 8px 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem; /* Smaller text */
  }
`;

const LogoutButton = styled.button`
  background: #112211;
  color: #ffffff;
  border: 1.36px solid #8dd3bb;
  border-radius: 6.8px;
  padding: 10px;
  cursor: pointer;
  font-family: "Montserrat";
  font-weight: 600;
  font-size: 13.6px;
  width: 100%;
  height: 38.4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.6s ease, color 0.6s ease, border-color 0.6s ease, transform 0.3s ease;

  &:hover {
    background: #ffffff;
    color: #112211;
    border-color: #112211;
    transform: scale(1.05);
  }

  &:active {
    background: #004c3f;
    color: white;
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    font-size: 12px; /* Slightly smaller */
    padding: 8px;
    height: 36px;
  }
`;

const Form = styled.form`
  width: 408px; /* Default for desktop */
  max-width: 100%; /* Prevent overflow */
  border-radius: 16.8px;
  padding: 47.2px;
  box-shadow: 0 2.72px 13.6px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.9);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 90%; /* Full width with margin */
    padding: 20px; /* Reduced padding */
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16.8px;
  position: relative; /* For dropdown positioning */
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6.8px;
  font-weight: bold;
  font-size: 17.6px;
  color: #112211;

  @media (max-width: 768px) {
    font-size: 14px; /* Smaller labels */
  }
`;

const Input = styled.input`
  width: 100%; /* Full width */
  max-width: 408px; /* Desktop max */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5.4px;
  background-color: transparent;
  color: #112211;
  outline: none;
  font-size: 15.6px;
  height: 38px; /* Increased for touch */
  box-sizing: border-box; /* Include padding in width */
  transition: border 0.3s ease-in-out;

  &:focus {
    border-color: #8dd3bb;
  }

  @media (max-width: 768px) {
    font-size: 14px; /* Readable but smaller */
    height: 40px; /* Larger touch target */
  }
`;

const Button = styled.button`
  background: #112211;
  border: 1.36px solid #8dd3bb;
  border-radius: 6.8px;
  color: #ffffff;
  font-family: "Montserrat";
  width: 100%;
  height: 38.4px;
  font-weight: 600;
  font-size: 13.6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    animation: ${buttonHoverScale} 0.2s forwards;
    background: #ffffff;
    color: #112211;
    border-color: #112211;
  }

  &:active {
    background: #004c3f;
    color: white;
    transform: scale(0.95);
    transition: transform 0.15s ease;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    height: 40px; /* Larger tap area */
    padding: 10px;
  }
`;

const Title = styled.h1`
  display: block;
  margin-bottom: 32px;
  font-weight: bold;
  font-size: 24px;
  color: #112211;
  text-align: center;
  animation: ${fadeInSlideDown} 1s ease;

  @media (max-width: 768px) {
    font-size: 20px; /* Smaller title */
    margin-bottom: 20px;
  }
`;

const MessagePopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 300;
  text-align: center;
  width: 90%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 300px; /* Smaller popup */
  }
`;

const PopupText = styled.p`
  color: #112211;
  font-size: 16px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%; /* Below input */
  left: 0;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 150px;
  overflow-y: auto;
  z-index: 100;
  width: 100%; /* Match input width */
  box-sizing: border-box;

  @media (max-width: 768px) {
    max-height: 120px; /* Smaller dropdown */
  }
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  color: #112211;
  font-size: 15.6px;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const destinations = [
  "Munnar",
  "Madurai",
  "Kodaikanal",
  "Coimbatore",
  "Yercaud",
  "Pondicherry",
];

const TripForm = () => {
  const { user, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    totalDays: "",
    startDate: "",
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "destination") {
      const filtered = destinations.filter((destination) =>
        destination.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDestinations(filtered);
      setShowDropdown(value !== "");
    }
  };

  const handleDropdownItemClick = (destination) => {
    setFormData({ ...formData, destination });
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const { destination, totalDays, startDate } = formData;

    try {
      navigate("/attractions", { state: { destination, startDate, totalDays } });
    } catch (error) {
      console.error("Error fetching attractions:", error);
    }
  };

  return (
    <Container>
      <Header>
        {user ? (
          <>
            <ProfileButton onClick={() => setShowPopup(!showPopup)}>
              <FiUser />
              {user.name}
            </ProfileButton>
            {showPopup && (
              <ProfilePopup>
                <PopupItem>Name: {user.name}</PopupItem>
                <PopupItem>Email: {user.email}</PopupItem>
                <LogoutButton onClick={logout}>Log Out</LogoutButton>
              </ProfilePopup>
            )}
          </>
        ) : (
          <ProfileButton onClick={() => navigate("/login")}>
            <FiUser />
            Login
          </ProfileButton>
        )}
      </Header>
      <Form onSubmit={handleSubmit}>
        <Title>Plan Your Trip</Title>
        <FormGroup>
          <Label>Destination</Label>
          <div style={{ position: "relative" }}>
            <Input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              onFocus={() => setShowDropdown(true)}
            />
            {showDropdown && filteredDestinations.length > 0 && (
              <Dropdown ref={dropdownRef}>
                {filteredDestinations.map((destination) => (
                  <DropdownItem
                    key={destination}
                    onClick={() => handleDropdownItemClick(destination)}
                  >
                    {destination}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </div>
        </FormGroup>
        <FormGroup>
          <Label>Total Days</Label>
          <Input
            type="number"
            name="totalDays"
            value={formData.totalDays}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Start Date</Label>
          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
      {showLoginPrompt && (
        <MessagePopup>
          <PopupText>Please log in to submit your trip details.</PopupText>
        </MessagePopup>
      )}
    </Container>
  );
};

export default TripForm;