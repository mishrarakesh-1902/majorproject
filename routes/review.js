// const express = require('express');
// const router = express.Router({ mergeParams: true });
// const Listing = require('../models/listing.js');
// const Review = require('../models/review.js');
// const ExpressError = require('../utils/ExpressError.js');
// const wrapAsync = require('../utils/wrapAsync.js');
// const { reviewSchema } = require('../schema.js');

// // ✅ Validate Review Middleware
// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const errMsg = error.details.map(el => el.message).join(', ');
//         throw new ExpressError(400, errMsg);
//     }
//     next();
// };

// // ✅ POST route to add review
// router.post('/', validateReview, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     console.log("Review received for listing:", id);

//     const listing = await Listing.findById(id);
//     if (!listing) res.status(404).send("Listing not found");

//     const reviewData = req.body.review;
//     if (!reviewData.rating) {
//         res.status(400).send("Rating is required");
//     }

//     const review = new Review(reviewData); // ✅ fixed variable
//     listing.reviews.push(review);
//     await review.save();
//     await listing.save();

//     req.flash("success", "New Review Created!");
//     console.log("✅ Review saved. Redirecting to:", `/listings/${id}`);
//     res.redirect(`/listings/${id}`);
// }));

// // ✅ DELETE route to delete review
// router.delete('/:reviewId', wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);

//     req.flash("success", "Review Deleted!");
//     res.redirect(`/listings/${id}`);
// }));

// module.exports = router;


const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// ✅ POST: Create Review
router.post('/', validateReview,isLoggedIn, wrapAsync(reviewController.createReview));

// ✅ DELETE: Delete Review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
