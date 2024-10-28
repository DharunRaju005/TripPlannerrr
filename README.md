
# Trip Planner

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Client URL](#client-url)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Project Overview
Trip Planner is a travel planning application that allows users to find attractions and nearby restaurants based on their travel preferences. The application uses real-time data to enhance the user experience, providing suggestions tailored to the user's chosen destinations and travel dates.

## Features
- User authentication with JWT tokens for secure access.
- Weather-based attraction suggestions using OpenWeather API.
- Nearby restaurant recommendations for each attraction utilizing SERP API.
- Geolocation services with OpenCage API.
- Easy-to-use interface for selecting attractions and planning trips.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **APIs Used:** 
  - OpenCage for geolocation
  - OpenWeather for weather data
  - SERP API for restaurant suggestions

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trip-planner.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd trip-planner/backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables in a `.env` file (refer to `.env.example` for the structure).
5. Start the server:
   ```bash
   npm start
   ```

## Usage
- Register a new user by navigating to the registration endpoint.
- Log in to access personalized travel planning features.
- Input your travel destination and dates to receive suggestions for attractions and nearby restaurants.

## API Endpoints
- **POST** `/register` - Register a new user.
- **POST** `/login` - Log in an existing user.
- **POST** `/logout` - Log out a user.
- **GET** `/attractions` - Get suggested attractions based on user input.


## Environment Variables
Ensure to create a `.env` file in the backend directory with the following variables:

```plaintext
PORT=7000

# OpenCage API Key
OPENCAGE_API_KEY=your_opencage_api_key_here

# PostgreSQL Credentials
PS_HOST=your_postgresql_host_here
PS_USER=your_postgresql_user_here
PS_DB_NAME=your_postgresql_db_name_here
PS_PASSWORD=your_postgresql_password_here
PS_PORT=5432
PS_CONNECTION_STRING=your_postgresql_connection_string_here

# Weather API Key
OPEN_WEATHER_KEY=your_open_weather_api_key_here

# SERP API Key
SERP_KEY=your_serp_api_key_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

## Client URL
You can access the Trip Planner application at: [https://tripplannerrclient.onrender.com/](https://tripplannerrclient.onrender.com/)

## Future Improvements
- Enhance user interface for a better user experience.
- Add more detailed user preferences for personalized suggestions.
- Implement payment processing for booking attractions.
- Include user-generated content, such as reviews and ratings.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
