import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import bannerImage from "../assets/seaside.jpg";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

// Keyframes for Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components with mobile optimizations (unchanged)
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url(${bannerImage});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 20px;
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Form = styled.form`
  width: 346.8px;
  max-width: 100%;
  border-radius: 14.3px;
  padding: 40.12px;
  box-shadow: 0 2.31px 11.56px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.9);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 90%;
    padding: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 12.75px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5.78px;
  font-weight: bold;
  font-size: 14.96px;
  color: #112211;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const Input = styled.input`
  width: 100%;
  max-width: 346.8px;
  padding: 8.5px;
  border: 1px solid #ccc;
  border-radius: 4.59px;
  background-color: transparent;
  color: #112211;
  outline: none;
  font-size: 13.26px;
  height: 32px;
  box-sizing: border-box;
  transition: border 0.3s ease-in-out;

  &:focus {
    border-color: #8dd3bb;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    height: 36px;
  }
`;

const Spinner = styled.div`
  border: 1.7px solid rgba(255, 255, 255, 0.6);
  border-top: 1.7px solid #fff;
  border-radius: 50%;
  width: 15.3px;
  height: 15.3px;
  animation: ${spin} 0.6s linear infinite;

  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
  }
`;

const Button = styled.button`
  background: #112211;
  border: 1.156px solid #8dd3bb;
  border-radius: 5.78px;
  color: #ffffff;
  font-family: "Montserrat";
  width: 100%;
  height: 36px;
  font-weight: 600;
  font-size: 11.56px;
  cursor: pointer;
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
    transition: transform 0.15s ease;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    height: 38px;
    padding: 8px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 20.4px;
  color: #112211;
  text-align: center;
  margin-bottom: 27.2px;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const TextLink = styled.p`
  margin-top: 17px;
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

  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 12px;
  }
`;

// Function to determine base URL
const getBaseUrl = async () => {
  try {
    // Test localhost connection with a small timeout
    await axios.get('http://localhost:7000/ping', { timeout: 1000 });
    return 'http://localhost:7000';
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // Fallback to production if localhost fails or times out
    return 'https://tripplannerbe.onrender.com';
  }
};

const SignUp = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState(null);
  const navigate = useNavigate();

  // Determine base URL on component mount
  useEffect(() => {
    getBaseUrl().then(url => {
      setBaseUrl(url);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Wait for baseUrl to be set
    if (!baseUrl) {
      setError("Initializing connection... please wait");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseUrl}/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: "include",
      });

      login({ name: formData.full_name, email: formData.email });
      navigate("/", { state: { message: "Sign up successful! Welcome!" } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Create an Account</Title>
        {error && <p style={{ color: "red", textAlign: "center", fontSize: "12px" }}>{error}</p>}
        <FormGroup>
          <Label htmlFor="username">Username:</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="full_name">Full Name:</Label>
          <Input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
        </FormGroup>
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
        <FormGroup>
          <Label htmlFor="bio">Bio:</Label>
          <Input
            type="text"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <Button type="submit" disabled={loading}>
          {loading ? <Spinner /> : "Sign Up"}
        </Button>
        <TextLink>
          Already have an account? <a onClick={() => navigate("/login")}>Login</a>
        </TextLink>
      </Form>
    </Container>
  );
};

export default SignUp;