
// Dependencies
// =============================================================
var path = require("path");
var db = require("../models");
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  // root route is sign up page
  app.get("/", function(req, res) {
    // If the user already has an account send them to the view page
    if (req.user) {
      res.redirect("/view");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  app.get("/signup", function(req, res) {
    // If the user already has an account send them to the view page
    if (req.user) {
      res.redirect("/view");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  // new "index" 
  app.get("/view", isAuthenticated, function(req, res) {
    //if the user just registered the req.user.user_id wont be set
    //will be null in the table  
    if (req.user.id) {
      var userId = req.user.id
    } else {
      //else look for the id in the req.session.passport.user
      var userId = req.session.passport.user.id
    }

    db.Transaction.findAll({
      limit: 10,
      where: {
        UserId: userId
      },
      order: [ [ 'date', 'DESC' ]]
    }).then(function (dbTransactionAll) {
      res.render("index", {trans:dbTransactionAll});
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
