import "dotenv/config";

const ENV_CONFIG = {
    PORT : process.env.PORT,
    DB_URI : process.env.DB_URI!!,
    NODE_ENV : process.env.NODE_ENV,

    // JWT
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN,

    // SMTP /Email
    SMTP_HOST : process.env.SMTP_HOST,
    SMTP_PORT : process.env.SMTP_PORT,
    SMTP_USER : process.env.SMTP_USER,
    SMTP_PASS : process.env.SMTP_PASS,

    // frontend
    FRONTEND_URL : process.env.FRONTEND_URL,

}

export default ENV_CONFIG;