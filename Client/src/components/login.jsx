import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bannerImage from "../assets/seaside.jpg"; // Ensure this path is correct
import axios from "axios";
import { useAuth } from "../hooks/useAuth"; // Import the useAuth hook

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(${bannerImage});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
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
  height: 29.6px;
  transition: border 0.3s ease-in-out;

  &:focus {
    border-color: #8dd3bb;
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
  transition: background-color 0.6s ease, color 0.6s ease,
    border-color 0.6s ease, transform 0.3s ease;

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
    transition: transform 0.15s ease;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 24px;
  color: #112211;
  text-align: center;
  margin-bottom: 32px;
`;

const TextLink = styled.p`
  margin-top: 20px;
  text-align: center;
  color: #112211;
  font-size: 14px;
  cursor: pointer;

  a {
    color: #8dd3bb;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #004c3f;
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to hold error messages
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from useAuth

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://tripplannerfe.onrender.com/login", formData, { withCredentials: true });
      console.log("Login successful:", response.data);
      
      // Make sure this matches your response structure
      const userData = { name: response.data.user.username, email: response.data.user.email };
      console.log(userData);
      
      // Store user data in the global context
      login(userData); // Call the login function from useAuth
      
      navigate("/");  // Redirect on successful login
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    }
  };
  

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Login to Your Account</Title>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
        <FormGroup>
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button type="submit">Login</Button>
        <TextLink>
          Don’t have an account? <a onClick={() => navigate("/signup")}>Sign Up</a>
        </TextLink>
      </Form>
    </Container>
  );
};

export default Login;
