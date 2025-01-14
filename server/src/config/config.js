import dotenv from 'dotenv';

dotenv.config();

const config = {
    mongodb_uri: process.env.MONGODB_URI,
    port: process.env.PORT || 3000,
    client_url: process.env.CLIENT_URL || 'http://localhost:5173'
};

export default config;
