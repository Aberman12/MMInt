var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test");

var db = mongoose.connection;

db.on("error", function() {
  console.log("mongoose connection error");
});

db.once("open", function() {
  console.log("mongoose connected successfully");
});

var itemSchema = mongoose.Schema({
  rateCard: Number,
  remnantRate: Number,
  production: Number,
  install: Number,
  markup: Number
});

var Item = mongoose.model("Item", itemSchema);

var selectAll = function(callback) {
  var size;
  var total;
  var discount;
  Item.find({}, function(err, items) {
    if (err) {
      callback(err, null);
    } else {
      size = Object.keys(items);
      if (size && size.length === 5) {
        total =
          items.rateCard +
          items.remnantRate +
          items.production +
          items.install +
          items.markup;
        discount = Math.round(total * 0.75);
        callback(null, { discount, total });
      }
    }
  });
};

var post = function(obj, callback) {
  var size;
  var total;
  var discount;
  new Item({
    rateCard: obj.rateCard,
    remnantRate: obj.remnantRate,
    production: obj.production,
    install: obj.install,
    markup: obj.markup
  }).save(function(err) {
    if (err) {
      console.log("error saving item inside post:mongooseDB", err);
      callback(err, null);
    } else {
      size = Object.keys(obj);
      if (size && size.length === 5) {
        total =
          obj.rateCard +
          obj.remnantRate +
          obj.production +
          obj.install +
          obj.markup;
        discount = Math.round(total * 0.75);
        callback(null, { discount, total });
      } else {
        callback(null, "not all properites found");
      }
    }
  });
};

module.exports = {
  selectAll,
  post
};
