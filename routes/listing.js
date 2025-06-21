const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');  
const wrapAsync = require('../utils/wrapAsync.js');
const flash = require("connect-flash");
const { isLoggedIn ,isOwner, validateListing } = require('../middleware.js');
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

const User = require("../models/user"); // assuming user model exists

const listingController = require("../controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn , upload.single('listing[image]'), validateListing,
        
    wrapAsync(listingController.createListing)
);


//New routes for open form for creating new routes
router.get("/new", isLoggedIn ,listingController.renderNewForm);    



router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn ,isOwner,upload.single('listing[image]'), validateListing, 
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn ,isOwner , wrapAsync(listingController.destroyListing))






//edit route creation
router.get("/:id/edit",isLoggedIn ,isOwner , wrapAsync(listingController.renderEditForm));




module.exports = router;



































































