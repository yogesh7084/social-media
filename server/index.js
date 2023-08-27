import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import mongoose from "mongoose";
import AuthRoute from './Routes/AuthRoutes.js'
import UserRoutes from './Routes/UserRoutes.js'
import PostRoutes from './Routes/PostRoutes.js'
import UploadRoutes from './Routes/UploadRoutes.js'
import ChatRoutes from './Routes/ChatRoutes.js'
import MessageRoutes from './Routes/MessageRoutes.js'

dotenv.config();

const app = express();

// for accessing images for public
app.use(express.static('public'))
app.use('/images', express.static("images"))

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.get('/', (req, res) => {
    res.send("Hello")
})

mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() =>
        app.listen(process.env.PORT,
            () => console.log(`Server is started on ${process.env.PORT}`))
    ).catch((err) => console.log(err));

// Routess

app.use('/auth', AuthRoute);
app.use('/user', UserRoutes);
app.use('/post', PostRoutes)
app.use('/upload', UploadRoutes)
app.use('/chat', ChatRoutes)
app.use('/message', MessageRoutes)