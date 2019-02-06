var express       = require("express"),
router            = express.Router(),
Blog              = require("../models/blog")

router.get("/", (req, res) => {
  Blog.find({}, (err, blogsFound) => {
    if(err){
      console.log(err);
    } else{
      res.render("blog/index", {blogsFound: blogsFound});
    }
  })
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("blog/new");
});

router.post("/", isLoggedIn, (req, res) => {
  var newBlog = {
    title: req.body.title,
    body: req.body.body
  };
  Blog.create(newBlog, (err, newBlog) => {
    if(err){
      console.log(err)
    } else{
      res.redirect("/blog")
    }
  });
});

router.get("/:id", (req, res) => {
  Blog.findById(req.params.id, (err, blogFound) => {
    if(err){
      console.log(err);
    } else{
      res.render("blog/show", {blogFound: blogFound});
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


module.exports = router;
