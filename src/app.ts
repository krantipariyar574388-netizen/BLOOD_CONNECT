import express from "express";

const app = express();

app.use(express.json());

app.get("/",(req, res) => {
    res.status(200).json({
        message : "Server is up and running!!",
        status : "success",
        success : true,
        data : [],
    });
});

export default app;