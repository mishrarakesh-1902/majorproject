// app.js (Fully Working Version for Wanderlust Project)

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// 📁 app.js
const bookingRoutes = require("./routes/bookings");


// Models
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

// Routes
const listingsRouter = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Database URL
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

// Database connection
mongoose.connect(dbUrl)
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.error("❌ DB connection error:", err));

// View engine and public directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET || "thisshouldbeabettersecret" },
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.error("SESSION STORE ERROR", e);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Auth Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash and current user middleware
app.use((req, res, next) => {
  res.locals.currUser = req.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.search = req.query.search || "";
  next();
});

// ✅ Mount this AFTER session/passport and BEFORE your other routes
app.use("/listings/:id/bookings", bookingRoutes);

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRouter);
app.use("/", bookingRoutes);
// Home Route
app.get("/", async (req, res) => {
  const allListings = await Listing.find({}).populate("owner");
  res.render("listings/index", { allListings, search: "", category: "" });
});

// 404 handler
// app.all("*", (req, res, next) => {
//   const err = new Error("Page Not Found");
//   err.statusCode = 404;
//   next(err);
// });

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});