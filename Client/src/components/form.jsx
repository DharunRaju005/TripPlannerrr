import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import bannerImage from "../assets/seaside.jpg"; // Ensure this path is correct
import { FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";  // Adjust the path to match your directory structure

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

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url(${bannerImage});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const Header = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
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

  &:hover {
    color: #8dd3bb;
  }
`;

const ProfilePopup = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PopupItem = styled.div`
  font-size: 1rem;
  color: #333;
  padding: 8px 0;
`;

const LogoutButton = styled.button`
  background: #112211;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background-color: #8dd3bb;
    color: #112211;
  }
`;

const Form = styled.form`
  width: 408px;
  border-radius: 16.8px;
  padding: 47.2px;
  box-shadow: 0 2.72px 13.6px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.9);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16.8px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6.8px;
  font-weight: bold;
  font-size: 17.6px;
  color: #112211;
`;

const Input = styled.input`
  width: 100%;
  padding: 13.6px;
  border: 1px solid #ccc;
  border-radius: 5.4px;
  box-sizing: border-box;
  background-color: transparent;
  color: #112211;
  outline: none;
  font-size: 15.6px;
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
`;

const Title = styled.h1`
  display: block;
  margin-bottom: 6.8px;
  font-weight: bold;
  font-size: 24px;
  color: #112211;
  text-align: center;
  margin-bottom: 32px;
  animation: ${fadeInSlideDown} 1s ease;
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
`;

const PopupText = styled.p`
  color: #112211;  /* Set the text color to #112211 */
`;

const TripForm = () => {
  const { user, logout } = useAuth();
  const [showPopup, setShowPopup] = useState(false); // State to manage the profile popup
  const [formData, setFormData] = useState({
    destination: "",
    totalDays: "",
    startDate: "",
  });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // State to manage login prompt
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginPrompt(true); // Show login prompt if user is not logged in
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
              {user.name} {/* Display the logged-in user's name */}
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
        <FormGroup>
          <Title>Plan your Destination!</Title>
          <Label htmlFor="destination">Destination:</Label>
          <Input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="startDate">Start Date:</Label>
          <Input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="totalDays">Total Days Planned:</Label>
          <Input
            type="number"
            id="totalDays"
            name="totalDays"
            value={formData.totalDays}
            onChange={handleChange}
            min="1"
            required
          />
        </FormGroup>
        <Button type="submit">Find</Button>
      </Form>

      {showLoginPrompt && (
        <MessagePopup>
          <PopupText>Please log in to use the form.</PopupText>
          <Button onClick={() => setShowLoginPrompt(false)}>Close</Button>
        </MessagePopup>
      )}
    </Container>
  );
};

export default TripForm;
