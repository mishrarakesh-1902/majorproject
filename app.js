// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema , reviewSchema} = require("./schema.js");
// const review = require("./models/review.js");
// const listings = require("./routes/listing.js");
// app.use("/listings/:id/reviews", reviewRoutes);
// const session = require("express-session");
// const { Session } = require("inspector/promises");
// const flash = require("connect-flash");
// const reviewRoutes = require("./routes/reviews.js");
// // ✅ Body parsing middleware
// app.use(express.urlencoded({ extended: true })); // for form data
// app.use(express.json()); // for JSON data


// const sessionOptions = {
//     secret: "mysupersecretcode", // secret key for signing the session ID cookie
//     resave: false,  // don't save session if unmodified                 
//     saveUninitialized: true, // save session even if unmodified
//     cookie: {
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // cookie expires in 7 days
//         maxAge: 1000 * 60 * 60 * 24 * 7, // cookie max age in milliseconds
//         httpOnly: true // prevent client-side JavaScript from accessing the cookie
//     },
// };


// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// }); 


// app.use(session(sessionOptions)); // for session management
// app.use(flash()); // for flash messages

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success"); // for success messages  
//     next();
// }); // middleware to set flash messages in response locals
   




// //set view engine
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(methodOverride("_method")); // for PUT and DELETE requests
// app.engine("ejs", ejsMate); // use ejsMate for layout support
// app.use(express.static(path.join(__dirname, "public"))); // serve static files from public directory
// //basic router setup
// app.get("/",(req,res)=> {
//     res.send("hi , i am root");
// });

// app.use("/listings", listings);

  
// app.use("/listings/:id/reviews", reviewRoutes);



// //connect database
// const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust";

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }
// //call the main function 
// main()
//     .then(() => {
//         console.log("connected to DB");

//     })
//      .catch((err) => {
//         console.log(err);
//      });








// //for cheak wiith all the createed route that the request route is availabe or not 
// // app.all("*", (req, res, next ) => {
// //     next(new ExpressError(404 , "Page Not Found!"));
// // });

// //error handling middleware
// app.use((err, req, res, next) => {
//     let { statusCode=500 , message="Something went wrong" } = err;
//     res.status(statusCode).render("error.ejs" , { message });
//     //res.status(statusCode).send(message);
// });    

// app.listen(8080, () => {
//     console.log("server is listening to port 8080");
// });


if(process.env.NODE_ENV != "production") {
    require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // For session storage in MongoDB
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); // Import User model
const listingsRouter = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");  // Import BEFORE usage
const currUser = require("./middleware.js"); // Import middleware for current user
const userRouter = require("./routes/user.js"); // Import user routes if needed
// Body parsing middleware
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json()); // for JSON data


const dbUrl = process.env.ATLASDB_URL;




const store = MongoStore.create({
    mongoUrl: dbUrl,     // Use your MongoDB connection string
    crypto: {
        secret:process.env.SECRET,
    }, // Optional: encrypt session data
    touchAfter: 24 * 3600, // How often to update the session
}); 

store.on("error" , () =>{
    console.log("Error in Mongo Session Store" , err);
});

// Session setup
const sessionOptions = {
    store,
    secret: process.env.SECRET, // Use a secret from environment variables
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
};

   







app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use User model for authentication

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Flash middleware to make flash messages available in templates
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Make current user available in templates
    next();
});

//search middleware
app.use((req, res, next) => {
    res.locals.search = req.query.search || "";
    next();
});


// app.get("/demouser" , async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });        

// Set view engine and views folder
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files and method override
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Basic routes
// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });

// Use routers
app.use("/listings", listingsRouter); // Use listingsRouter here
app.use("/listings/:id/reviews", reviewRoutes);  // Use reviewRoutes here (only once)
app.use("/", userRouter); // Use user routes if needed





async function main() {
    await mongoose.connect(dbUrl);
}
main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

// Error handler middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});



// // ✅ Make sure these are in correct order
// const express = require("express");
// const app = express();
// const path = require("path");
// const mongoose = require("mongoose");
// const methodOverride = require("method-override");
// const session = require("express-session");
// const flash = require("connect-flash");
// const ejsMate = require("ejs-mate");

// // ✅ Models
// const Listing = require("./models/listing.js");

// // ✅ Utilities
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");

// // ✅ Routes
// const listings = require("./routes/listing.js");
// const reviewRoutes = require("./routes/reviews.js"); // ✅ load BEFORE use

// // ✅ Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

// const sessionOptions = {
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7,
//         httpOnly: true
//     }
// };

// app.use(session(sessionOptions));
// app.use(flash());

// // ✅ Flash middleware
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });

// // ✅ Mount Routes AFTER defining them
// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviewRoutes);

// // ✅ Fallback route
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// });

// // ✅ Error handler
// app.use((err, req, res, next) => {
//     if (res.headersSent) {
//         return next(err);
//     }
//     const { statusCode = 500 } = err;
//     res.status(statusCode).render("error.ejs", { message: err.message });
// });

