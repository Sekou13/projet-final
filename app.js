const express = require('express');
const session = require('express-session');

const userRouter = require('./router/userRouter');
const carRouter = require('./router/carRouter');
const adminRouter = require('./router/adminRouter'); 

const app = express();
require("dotenv").config()

app.use("/uploads", express.static("uploads"));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: 'sekou',
    resave: true,
    saveUninitialized: true
}));

app.use(userRouter);
app.use(carRouter);
app.use(adminRouter); 

app.listen(process.env.NODE_PORT, () => {
    console.log(' Server is running on port 3000');
});
