var express       = require("express"),
app               = express(),
mongoose          = require("mongoose"),
keys              = require("./config/keys"),
//Routes
indexRoutes       = require("./routes/index"),
portfolioRoutes   = require("./routes/portfolio"),
blogRoutes        = require("./routes/blog"),
//User authentication
User              = require("./models/user"),
passport          = require("passport"),
LocalStrategy     = require("passport-local"),
//Uploading to DB
bodyParser        = require("body-parser");

//Passport Configuration
app.use(require("express-session")({
  secret: keys.passportSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Mongoose configuration
mongoose.connect(keys.mongoURI, {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));

//Express app configuration
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Express routes
app.use("/portfolio", portfolioRoutes);
app.use("/blog", blogRoutes);
app.use(indexRoutes);

//Deployed on Heroku port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Our app is running on port " + PORT);
});
