import "dotenv/config";

const ENV_CONFIG = {
    PORT : process.env.PORT,
    DB_URI : process.env.DB_URI!!,
    NODE_ENV : process.env.NODE_ENV,
}

export default ENV_CONFIG;