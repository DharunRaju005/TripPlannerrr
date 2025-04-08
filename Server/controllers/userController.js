const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

// Controller for registering a user
const registerUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await userService.registerUser(userData);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.cookie('token', token, { // Changed 'tp' to 'token' for consistency
      httpOnly: true,
      secure: false, // Set to false for local HTTP testing
      sameSite: 'Lax', // Works for local testing, adjust to 'None' for HTTPS
      maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        full_name: newUser.full_name,
        bio: newUser.bio
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller for logging in a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await userService.loginUser(email, password);

    res.cookie('token', token, { // Changed 'tp' to 'token'
      httpOnly: true,
      secure: false, // Set to false for local HTTP testing
      sameSite: 'Lax', // Works for local testing
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    });

    res.status(200).json({ 
      message: 'Logged in successfully', 
      user // Return user data only, token is in cookie
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller for logging out a user
const logout = async (req, res) => {
  res.clearCookie('token'); // Match cookie name
  return res.status(200).json({ message: "Cookie is deleted and logged out successfully" });
};

// Controller for getting a user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Controller for updating a user's profile
const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.params.id, req.body);
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logout
};