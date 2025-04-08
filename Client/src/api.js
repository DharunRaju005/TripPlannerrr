import axios from 'axios';

// Function to determine base URL
const getBaseUrl = async () => {
  const LOCALHOST_URL = 'http://localhost:7000';
  const PRODUCTION_URL = 'https://tripplannerbe.onrender.com';
  
  try {
    // Test localhost connection with a small timeout
    await axios.get(`${LOCALHOST_URL}/ping`, { timeout: 1000 });
    return LOCALHOST_URL;
  } catch (error) {
    // Fallback to production if localhost fails or times out
    return PRODUCTION_URL;
  }
};

// Initialize API_BASE_URL asynchronously
let API_BASE_URL = null;

// Get the base URL once when the module loads
getBaseUrl().then(url => {
  API_BASE_URL = `${url}/attraction`;
}).catch(error => {
  console.error('Failed to determine base URL:', error);
  // Default to production URL if determination fails
  API_BASE_URL = 'https://tripplannerbe.onrender.com/attraction';
});

// Helper function to wait for API_BASE_URL to be initialized
const getInitializedBaseUrl = async () => {
  if (API_BASE_URL) return API_BASE_URL;
  
  // If not initialized yet, wait for it
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (API_BASE_URL) {
        clearInterval(checkInterval);
        resolve(API_BASE_URL);
      }
    }, 100);
  });
};

export const getAttraction = async (destination, days, cat, date) => {
  try {
    const baseUrl = await getInitializedBaseUrl();
    const response = await axios.get(`${baseUrl}/getAttraction`, {
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
    const baseUrl = await getInitializedBaseUrl();
    const response = await axios.get(`${baseUrl}/getAttractionDetails`, {
      params: { destination },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attraction details:", error);
    throw error;
  }
};