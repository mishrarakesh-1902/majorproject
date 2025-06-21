const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
       url: String,
       filename: String, 
    },
    
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: ["trending", "rooms", "iconic cities", "mountain", "castle", "surfing", "camping", "farm" , "arctic" , "pool" , "beach" , "lakefront" , "boat" , "bamboo"],
        required: true,
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
       type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },

});

// Middleware to delete reviews when a listing is deleted (code number: 27)
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews,
            },
        });
    }
});


const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
