import dotenv from "dotenv";
dotenv.config();

const SERVER_HOSTNAME = process.env.HOSTNAME || 'localhost';
const SERVER_PORT = process.env.PORT || 1313;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}
const config = {
    server: SERVER
}

export default config;