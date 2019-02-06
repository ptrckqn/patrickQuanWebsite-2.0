var mongoose = require("mongoose");

var ImageSchema = new mongoose.Schema({
  imagePath: String,
  public_id: String,
  imageLocation: String,
  portfolioName: String
});

module.exports = mongoose.model("Image", ImageSchema);
