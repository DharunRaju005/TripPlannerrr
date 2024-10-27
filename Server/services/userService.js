const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {pool}=require("../config/postgresClient") // Assuming you're using Sequelize ORM
const dotenv=require('dotenv');
dotenv.config();

const JWT_SECRET =process.env.JWT_SECRET ;
// Register a user
const registerUser = async (userData) => {
    const { username, email, password, full_name, bio } = userData;
    console.log('line11',userData);
    // Check if the user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
        throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(
        'INSERT INTO users (username, email, password, full_name, bio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [username, email, hashedPassword, full_name, bio]
    );

    
    return result.rows[0];
};


// Function to login user
const loginUser = async (email, password) => {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
        throw new Error('User not found');
    }


    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, JWT_SECRET, { expiresIn: '1h' });


    return { token, user: user.rows[0] };
};


const getUserProfile=async(userId)=>{
    try{
        const q=`select * from users where  id=$1`;
        const res=await pool.query(q,[userId]);
        if(res.rows.length==0){
            return {error:'User Not Found',status:404};
        }
        const user=res.rows[0];
        return {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            // profile_picture: user.profile_picture,
            bio: user.bio,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        return { error: 'An error occurred while fetching the user profile', status: 500 };
    }
    
}

const getUserProfileByName=async(userId)=>{
    try{
        const q=`select * from users where  full_name like %$1%`;
        const res=await pool.query(q,[userId]);
        if(res.rows.length==0){
            return {error:'User Not Found',status:404};
        }
        const user=res.rows[0];
        return {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            // profile_picture: user.profile_picture,
            bio: user.bio,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        return { error: 'An error occurred while fetching the user profile', status: 500 };
    }
    
}
// hello

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getUserProfileByName
};
