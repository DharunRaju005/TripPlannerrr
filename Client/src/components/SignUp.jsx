import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import bannerImage from "../assets/seaside.jpg";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

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
  width: 346.8px; /* Reduced from 408px */
  border-radius: 14.3px; /* Reduced from 16.8px */
  padding: 40.12px; /* Reduced from 47.2px */
  box-shadow: 0 2.31px 11.56px rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.9);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 12.75px; /* Reduced from 15px */
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5.78px; /* Reduced from 6.8px */
  font-weight: bold;
  font-size: 14.96px; /* Reduced from 17.6px */
  color: #112211;
`;

const Input = styled.input`
  max-width: 346.8px;
  min-width: 328.95px; /* Reduced from 387px */
  padding: 8.5px; /* Reduced from 10px */
  border: 1px solid #ccc;
  border-radius: 4.59px; /* Reduced from 5.4px */
  background-color: transparent;
  color: #112211;
  outline: none;
  font-size: 13.26px; /* Reduced from 15.6px */
  height: 25.16px; /* Reduced from 29.6px */
  transition: border 0.3s ease-in-out;

  &:focus {
    border-color: #8dd3bb;
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 1.7px solid rgba(255, 255, 255, 0.6); /* Reduced from 2px */
  border-top: 1.7px solid #fff;
  border-radius: 50%;
  width: 15.3px; /* Reduced from 18px */
  height: 15.3px; /* Reduced from 18px */
  animation: ${spin} 0.6s linear infinite;
`;

const Button = styled.button`
  background: #112211;
  border: 1.156px solid #8dd3bb; /* Reduced from 1.36px */
  border-radius: 5.78px; /* Reduced from 6.8px */
  color: #ffffff;
  font-family: "Montserrat";
  width: 100%;
  height: 36px; /* Reduced from 38.4px */
  font-weight: 600;
  font-size: 11.56px; /* Reduced from 13.6px */
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
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 20.4px; /* Reduced from 24px */
  color: #112211;
  text-align: center;
  margin-bottom: 27.2px; /* Reduced from 32px */
`;

const TextLink = styled.p`
  margin-top: 17px; /* Reduced from 20px */
  text-align: center;
  color: #112211;
  font-size: 14px; /* Reduced from 14px */
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post("https://tripplannerbe.onrender.com/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        credentials: 'include'

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
        {error && <p style={{ color: "red" }}>{error}</p>}
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
