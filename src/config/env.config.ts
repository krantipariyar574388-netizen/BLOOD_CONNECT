import "dotenv/config";

const ENV_CONFIG = {
    PORT : process.env.PORT,
    DB_URI : process.env.DB_URI!!,
    NODE_ENV : process.env.NODE_ENV,

    // JWT
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN,
}

export default ENV_CONFIG;