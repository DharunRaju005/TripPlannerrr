import axios from 'axios';

const API_BASE_URL = 'http://localhost:7000/attraction'; // Adjust if hosted elsewhere

export const getAttraction = async (destination, days, cat, date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAttraction`, {
      params: { destination, days, cat, date },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attractions:", error);
    throw error; 
  }
};

export const getAttractionDetails = async (destination) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAttractionDetails`, {
      params: { destination },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attraction details:", error);
    throw error; 
  }
};
