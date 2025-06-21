// const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });




// // module.exports.index = async (req, res) => {
// //     const allListings = await Listing.find({});
// //     res.render("listings/index.ejs", { allListings }); //check error
// // };

// module.exports.index = async (req, res) => {
//     const { category } = req.query;

//     let allListings;
//     if (category) {
//         allListings = await Listing.find({ category });
//     } else {
//         allListings = await Listing.find({});
//     }

//     res.render("listings/index.ejs", { allListings });
// };


// module.exports.renderNewForm = (req, res)=> {
//     res.render("listings/new.ejs" , {listing: {} });
// }

// module.exports.showListing = async(req,res) => {
//     const{id} = req.params;
//     const listing = await Listing.findById(id).populate({path: "reviews", populate: {
//         path: "author",
//     },
// }).populate("owner");
//     if (!listing) {

//         req.flash("error", "Listing not found");
//         return res.redirect("/listings");
//     }
    
//     res.render("listings/show.ejs", { listing });
// };


// module.exports.createListing = async (req , res , next) => {
//     let response = await geocodingClient
//         .forwardGeocode({
//             query: req.body.listing.location,
//             limit: 1,
//         })
//         .send();
        
//     let url = req.file.path;
//     let filename = req.file.filename;       
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = {url, filename};

//     newListing.geometry = response.body.features[0].geometry;

//     let savedListing = await newListing.save();
//     console.log(savedListing);

//     req.flash("success", "Successfully created a new listing!");
//     res.redirect("/listings"); 
    
    
// };


// module.exports.renderEditForm = async (req, res, next) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing not found");
//         res.redirect("/listings");
//     }

//     let originalImageUrl = listing.image.url;
//     originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
//     res.render("listings/edit.ejs", { listing , originalImageUrl });
// };  


// module.exports.updateListing = async(req,res) => {       
//         let{ id } = req.params;
//         let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); 

//         if (typeof req.file !=="undefined") {
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = {url , filename};
//         await listing.save();
//         }    
//         req.flash("success", "Listing Updated!");   
//         res.redirect(`/listings/${id}`);                
// };


// module.exports.destroyListing = async(req,res) => {
//     let{id} = req.params;
//     let deletedListing  = await Listing.findByIdAndDelete(id);
//     req.flash("success", "Successfully Deleted  listing!");
//     res.redirect("/listings");
// };


const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const User = require("../models/user");

// SHOW ALL LISTINGS OR FILTER BY CATEGORY
// module.exports.index = async (req, res) => {
//     const { category } = req.query;

//     let allListings;
//     if (category) {
//         allListings = await Listing.find({ category });
//     } else {
//         allListings = await Listing.find({});
//     }

//     res.render("listings/index.ejs", { allListings });
// };






module.exports.index = async (req, res) => {
    const { search, category } = req.query;

    try {
        let filter = {};

        // Handle search by title/location/owner
        if (search && search.trim() !== "") {
            const regex = new RegExp(search.trim(), "i");

            // Search for owner by username
            const owner = await User.findOne({ username: regex });

            filter.$or = [
                { title: regex },
                { location: regex },
                ...(owner ? [{ owner: owner._id }] : [])
            ];
        }

        // If category is selected
        if (category && category.trim() !== "") {
            filter.category = category;
        }

        const allListings = await Listing.find(filter).populate("owner");

        // If search was made and no results found
        if ((search || category) && allListings.length === 0) {
            return res.status(404).render("listings/notfound", { search });
        }

        res.render("listings/index", {
            allListings,
            search: search || "",
            category: category || ""
        });

    } catch (err) {
        console.error("Error in listing search/filter:", err);
        res.status(500).send("Server Error");
    }
};








// module.exports.index = async (req, res) => {
//     const { search } = req.query;

//     try {
//         let allListings = [];

//         if (search && search.trim() !== "") {
//             const regex = new RegExp(search, "i");

//             const owner = await User.findOne({ username: regex });

//             const filter = {
//                 $or: [
//                     { title: regex },
//                     { location: regex },
//                     ...(owner ? [{ owner: owner._id }] : [])
//                 ]
//             };

//             allListings = await Listing.find(filter).populate("owner");

//             if (allListings.length === 0) {
//                 return res.status(404).render("listings/notfound", { search });
//             }

//             return res.render("listings/index", { allListings, search });
//         }

//         // No search: show all listings
//         allListings = await Listing.find({}).populate("owner");
//         res.render("listings/index", { allListings, search: "" });

//     } catch (err) {
//         console.error("Search error:", err);
//         res.status(500).send("Server Error");
//     }
// };



// SHOW FORM TO CREATE NEW LISTING
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs", { listing: {} });
};

// SHOW A SPECIFIC LISTING
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// CREATE A NEW LISTING
module.exports.createListing = async (req, res) => {
  const { listing } = req.body;

  const geoResponse = await geocodingClient
    .forwardGeocode({ query: listing.location, limit: 1 })
    .send();

  if (!geoResponse.body.features.length) {
    req.flash("error", "Invalid location");
    return res.redirect("/listings/new");
  }

  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }

  newListing.geometry = {
    type: "Point",
    coordinates: geoResponse.body.features[0].geometry.coordinates
  };

  await newListing.save();
  req.flash("success", "Listing Created!");
  res.redirect("/listings");
};


// EDIT FORM
module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { listing } = req.body;
  const existing = await Listing.findByIdAndUpdate(id, listing, { new: true });

  if (req.file) {
    existing.image = { url: req.file.path, filename: req.file.filename };
  }
  await existing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE LISTING
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted Listing!");
    res.redirect("/listings");
};
