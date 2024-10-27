// src/App.js
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TripForm from '../src/components/form';
import AttractionsPage from './components/Attractions';
import AttractionDescriptionPage from './components/Attractions_Description';
import './index.css';
import ShortestPathPage from './components/ShortestPath';
import 'leaflet/dist/leaflet.css';
import Login from './components/login';
import SignUp from './components/SignUp';
import { AuthProvider } from './hooks/useAuth'; // Import AuthProvider if needed
import { AttractionsProvider } from './context/Attractionscontext'; // Import AttractionsProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <AttractionsProvider>
          <Routes>
            <Route path="/attractions" element={<AttractionsPage />} />
            <Route path="/attractions_description" element={<AttractionDescriptionPage />} />
            <Route path="/shortest-path" element={<ShortestPathPage />} />
          </Routes>
        </AttractionsProvider>
        <Routes>
          <Route path="/" element={<TripForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;