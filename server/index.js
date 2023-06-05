const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth; //載入 routers 這個資料夾並 return 該資料夾會出的物件 "auth"
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

// connect to mongodb
mongoose
    .connect("mongodb://127.0.0.1/merndb") 
    // .connect("mongodb://localhost:27017/merndb")
    // .connect("mongodb://0.0.0.0:27017/merndb") 
    .then(() => {
        console.log("Connect to mongodb.");
    })
    .catch((e) => {
        console.log(e);
    });


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extend: true }));
app.use(cors());

app.use("/api/user", authRoute);
// course route is suppose to be protected by jwt
// if there's no jwt in the request header, the request is unauthorized.
app.use("/api/course", 
    //? a middleware to protect the route "/api/course"
    passport.authenticate("jwt", { session: false }), 
    courseRoute
);

app.listen(9000, () => {
    console.log("Backend is ready.");
});