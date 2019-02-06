var express       = require("express"),
router            = express.Router(),
keys              = require("../config/keys")
Image             = require("../models/image"),
//Multer file upload
multer            = require("multer"),
storage           = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "public/uploads/images")
  },
  filename: function(req, file, cb){
    cb(null, Date.now() + ".jpg")
  }
}),
upload            = multer({storage: storage}),
cloudinary        = require("cloudinary");

//Media server configuration (Cloudinary)
cloudinary.config({
  cloud_name: keys.cloudinaryName,
  api_key: keys.cloudinaryKey,
  api_secret: keys.cloudinarySecret
});

router.get("/", (req, res) => {
  res.render("portfolio/index");
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("portfolio/new")
});

router.post("/", isLoggedIn, upload.single("uploadedImage"), (req, res) => {
  cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
    if(err){
      console.log(err);
    } else{
      Image.find({portfolioName: req.body.portfolioName, imageLocation: req.body.location}, (err, image) => {
        if(!image.length){
          var newImage = {
            imagePath: result.url,
            public_id: result.public_id,
            imageLocation: req.body.location,
            portfolioName: req.body.portfolioName
          };
          Image.create(newImage, (err, newImage) => {
            if(err){
              console.log(err);
            } else{
              res.redirect("/portfolio/" + req.body.portfolioName);
            }
          });
        } else{
          Image.find({portfolioName: req.body.portfolioName, imageLocation: req.body.location}, (err, foundImage) => {
            if(err){
              console.log(err);
            } else{
              cloudinary.v2.uploader.destroy(foundImage[0].public_id);
              foundImage[0].imagePath = result.url;
              foundImage[0].public_id = result.public_id;
              foundImage[0].save();
              res.redirect("/portfolio/" + req.body.portfolioName);
            }
          });
        }
      });
    }
  });
});

router.get("/:id", (req, res) => {
  Image.find({portfolioName: req.params.id}, (err, portfolioFound) => {
    if(!portfolioFound.length){
      res.send("404 Error. Page not found")
    } else{
      if(err){
        console.log(err);
      } else{
        Image.find({}, (err, allPortfolios) => {
          if(err){
            console.log(err);
          } else{
            res.render("portfolio/gallery", {portfolioFound: portfolioFound, allPortfolios: allPortfolios});
          }
        });
      }
    }
  });
});

//Function to verify user is logged in
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
