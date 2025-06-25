const express = require("express");
const router = express.Router({ mergeParams: true });
const bookingController = require("../controllers/bookings");
const { isLoggedIn } = require("../middleware");
const Booking = require("../models/booking");

// Route to show booking form and create a booking
router
  .route("/new")
  .get(isLoggedIn, bookingController.renderBookingForm)
  .post(isLoggedIn, bookingController.createBooking);

// ✅ NEW ROUTE: Show all bookings of logged-in user
router.get("/myBookings", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("bookings/myBookings", { bookings });
});

module.exports = router;
