// const Booking = require("../models/booking");
// const Listing = require("../models/listing");

// module.exports.renderBookingForm = async (req, res) => {
//     const listing = await Listing.findById(req.params.id);
//     res.render("bookings/new", { listing });
// };

// module.exports.createBooking = async (req, res) => {
//     const { id } = req.params;
//     const { fromDate, toDate, guests } = req.body;

//     const newBooking = new Booking({
//         listing: id,
//         user: req.user._id,
//         fromDate,
//         toDate,
//         guests,
//     });

//     await newBooking.save();

//     req.flash("success", "Booking successful!");
//     res.redirect(`/listings/${id}`);
// };


// 📁 controllers/bookings.js
const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.renderBookingForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("bookings/new", { listing });
};



module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { fromDate, toDate, guests } = req.body;

  const listing = await Listing.findById(id);

  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = to.getTime() - from.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Days between

  if (diffDays <= 0) {
    req.flash("error", "Invalid date range selected.");
    return res.redirect(`/listings/${id}`);
  }

  const totalPrice = diffDays * listing.price; // Assuming listing has `price` per night

  const newBooking = new Booking({
    listing: id,
    user: req.user._id,
    fromDate,
    toDate,
    guests,
    totalPrice,
  });

  await newBooking.save();

  req.flash("success", "Booking successful!");
  res.redirect(`/listings/${id}`);
};


