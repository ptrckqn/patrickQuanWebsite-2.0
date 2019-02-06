var express       = require("express"),
router            = express.Router(),
passport          = require("passport"),
//User authentication
User              = require("../models/user"),
passport          = require("passport"),
LocalStrategy     = require("passport-local"),
keys              = require("../config/keys"),
nodemailer        = require("nodemailer");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/about", (req, res) => {
  res.render("about");
});

//Contact form routes
router.get("/about/contact", (req, res) => {
  res.render("contact");
});

router.post("/about/contact", (req, res) => {
  var smtpTrans = nodemailer.createTransport({
    host:"smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: keys.nodemailerUser,
      pass: keys.nodemailerPass
    }
  });

  var mailOpts = {
    to: "p.quan@me.com",
    subject: "New Message From Patrickquan.me",
    text: "Name: " + req.body.name + "\nEmail: " + req.body.email + "\n\nMessage:\n" + req.body.message
  };

  smtpTrans.sendMail(mailOpts, function(err, response){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/portfolio");
    }
  })
})

router.get("/programming", (req, res) => {
  res.render("programming/index");
});

//Authentication Routes
// router.get("/register", (req, res) => {
//   res.render("register");
// });
//
// router.post("/register", (req, res) => {
//   var newUser = new User({username: req.body.username});
//   User.register(newUser, req.body.password, function(err, user){
//     if(err){
//       console.log(err);
//     } else{
//       passport.authenticate("local")(req, res, () => {
//         res.redirect("/portfolio")
//       });
//     }
//   });
// });

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/portfolio",
  failureRedirect: "/login"
}));

router.get("*", (req, res) => {
  res.send("404 Error. Page not found");
});

module.exports = router;
