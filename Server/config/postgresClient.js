const dotenv=require('dotenv');
dotenv.config();

// const { Client } = require('pg');


const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.PS_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});
 pool.connect(async(err, client, release) => {
  if (err) {
      console.error('Error acquiring client', err.stack);
  } else {
      client.query('SELECT NOW()', (err, result) => {
      release(); // release the client back to the pool
      if (err) {
        console.error('Error executing query', err.stack);
      } else {
        console.log('Connected to the database, current time:', result.rows[0]);
      }
    });
  }
});

const createTablesQuery = `
    CREATE EXTENSION IF NOT EXISTS postgis;

    CREATE TABLE IF NOT EXISTS destinations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),         -- Name of the destination
    description TEXT,          -- Description of the destination
    latitude DECIMAL(9,6),     -- Latitude for weather API queries
    longitude DECIMAL(9,6),    -- Longitude for weather API queries
    best_climate VARCHAR(255), -- Description of the best climate or season to visit
    ideal_temp_min DECIMAL(5,2),  -- Minimum ideal temperature (in Celsius or Kelvin) for visiting
    ideal_temp_max DECIMAL(5,2),  -- Maximum ideal temperature
    ideal_weather TEXT          -- Specific weather conditions preferred (e.g., clear, misty, etc.)
);

    CREATE TABLE IF NOT EXISTS attractions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),          -- Name of the attraction
    description TEXT,           -- Description of the attraction
    category VARCHAR(100),      -- Category of the attraction (e.g., Scenic, Historical, etc.)
    latitude DECIMAL(9,6),      -- Latitude for weather API queries
    longitude DECIMAL(9,6),     -- Longitude for weather API queries
    destination_id INT REFERENCES destinations(id),  -- Foreign key linking to destinations table
    best_climate VARCHAR(255),  -- Ideal climate description for visiting
    ideal_temp_min DECIMAL(5,2), -- Minimum ideal temperature (if different from destination)
    ideal_temp_max DECIMAL(5,2), -- Maximum ideal temperature
    ideal_weather TEXT,         -- Specific weather conditions preferred (if different from destination)
    location GEOGRAPHY(Point, 4326) -- Geospatial data of the attraction
);

`;

// Function to run the SQL queries
const createTables = async () => {
    const client = await pool.connect();
    try {
        console.log('Creating tables...');
        await client.query(createTablesQuery);  // Execute the SQL query
        console.log('Tables created successfully!');
    } catch (err) {
        console.error('Error creating tables:', err);
    } finally {
        client.release();  // Release the client back to the pool
    }
};


// Call the function to create the tables
createTables()
    .then(() => console.log('Table creation process complete'))
    .catch((err) => console.error('Error:', err));

    const listTablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
`;

const listTables = async () => {
    const client = await pool.connect();
    try {
        console.log('Fetching all tables...');
        const res = await client.query(listTablesQuery);
        console.log('Tables in the database:');
        res.rows.forEach(row => console.log(row.table_name));
    } catch (err) {
        console.error('Error fetching tables:', err);
    } finally {
        client.release(); // Release the client back to the pool
    }
};
module.exports = {pool,listTables};

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
// console.log('DB User:', process.env.PS_USER);
// console.log('DB Host:', process.env.PS_HOST);

// const client = new Client({
//   // connectionString:process.env.PS_DB_URL,
//   // ssl: false,
//   // connectionTimeoutMillis: 50000,
//   host: process.env.PS_HOST,     
//   port: process.env.PS_PORT,                      
//   user: process.env.PS_USER,    
//   password: process.env.PS_PASSWORD, 
//   database: process.env.PS_DB_NAME,  
 
// });

// const makePsConnect=()=>client.connect()
//   .then(() => console.log("Connected to PostgreSQL"))
//   .catch(err => console.error("Connection error", err));

// module.exports = {makePsConnect};
