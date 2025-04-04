const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const facultyRoute = require('./api/routes/faculty');
const studentRoute = require('./api/routes/student');
const userRoute = require('./api/routes/user');
const checkUsernameRoute = require('./api/routes/checkUsername');
const cartRoute = require('./api/routes/cart');
// Enable CORS for all requests
app.use(cors());

// OR, if you want to allow only specific origins:
// app.use(cors({
//     origin: 'http://localhost:5173', // Change to your frontend URL
//     methods: 'GET,POST,PUT,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
// }));
var mongoUrl = "mongodb+srv://nasifhossain040:hellokitty@basics.fu6g5c9.mongodb.net/?retryWrites=true&w=majority&appName=Basics";

mongoose.connect(mongoUrl);
mongoose.connection.on('error', err => {
    console.log('connection with database failed');
});
mongoose.connection.on('connected', () => {
    console.log('connected with db successfully');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/student', studentRoute);
app.use('/faculty', facultyRoute);
app.use('/user', userRoute);
app.use('/checkUsername', checkUsernameRoute);
app.use('/cart', cartRoute);

// Handle 404 errors


// General success response
app.use((req, res, next) => {
    res.status(200).json({ message: 'app is running' });

});

app.use((req, res, next) => {
    res.status(404).json({ error: "bad request" });
});

module.exports = app;
