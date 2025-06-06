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
  width: 408px;
  max-width: 100%;
  border-radius: 16.8px;
  padding: 40px;
  box-shadow: 0 2.72px 13.6px rgba(0, 0, 0, 0.2);
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
  margin-bottom: 16.8px;
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6.8px;
  font-weight: bold;
  font-size: 17.6px;
  color: #112211;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Input = styled.input`
  width: 100%;
  max-width: 408px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5.4px;
  background-color: transparent;
  color: #112211;
  outline: none;
  font-size: 15.6px;
  height: 38px;
  box-sizing: border-box;
  transition: border 0.3s ease-in-out;

  &:focus {
    border-color: #8dd3bb;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    height: 40px;
  }
`;

const Button = styled.button.attrs((props) => ({
  disabled: props.loading,
}))`
  background: ${({ loading }) => (loading ? "#ccc" : "#112211")};
  border: 1.36px solid #8dd3bb;
  border-radius: 6.8px;
  color: #ffffff;
  font-family: "Montserrat";
  width: 100%;
  height: 42px;
  font-weight: 600;
  font-size: 13.6px;
  cursor: ${({ loading }) => (loading ? "not-allowed" : "pointer")};
  transition: background-color 0.6s ease, color 0.6s ease, border-color 0.6s ease,
    transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ loading }) => (loading ? "#ccc" : "#ffffff")};
    color: ${({ loading }) => (loading ? "#ffffff" : "#112211")};
    border-color: #112211;
    transform: ${({ loading }) => (loading ? "none" : "scale(1.05)")};
  }

  &:active {
    background: ${({ loading }) => (loading ? "#ccc" : "#004c3f")};
    color: white;
    transform: ${({ loading }) => (loading ? "none" : "scale(0.95)")};
  }

  @media (max-width: 768px) {
    font-size: 12px;
    height: 40px;
    padding: 10px;
  }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: ${spin} 0.6s linear infinite;

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 24px;
  color: #112211;
  text-align: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
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

  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 15px;
  }
`;

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

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

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
    try {
      const response = await axios.post(`${baseUrl}/login`, formData, {
        withCredentials: true,
        credentials: "include",
      });
      console.log("Login successful:", response.data);
      const userData = {
        name: response.data.user.username,
        email: response.data.user.email,
      };
      login(userData);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Login to Your Account</Title>
        {error && <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>{error}</p>}
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
        <Button type="submit" loading={loading}>
          {loading ? <Spinner /> : "Login"}
        </Button>
        <TextLink>
          Don’t have an account? <a onClick={() => navigate("/signup")}>Sign Up</a>
        </TextLink>
      </Form>
    </Container>
  );
};

export default Login;