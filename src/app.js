const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const requestRouter = require('./routes/request');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const userRouter = require('./routes/user');
const paymentRouter = require('./routes/payment');
const chatRouter = require('./routes/chat');

app.use(
    cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Profile images are compressed in the web client before being sent as data URLs.
// Keep a strict upper bound while allowing those small profile-photo requests.
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);


connectDB()
    .then(() => {
        console.log("Database connected successfully -");
        app.listen(7777, () => {
            console.log("Server is running on port 7777");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected", err);
    });
