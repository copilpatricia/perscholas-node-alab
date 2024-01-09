const express = require("express");
const users = require("../data/users");
const error = require("../utilities/error");

const router = express.Router();

//GET - USERS
// creating a route for all the users
// in the data.js the format is different and we parse the data using res.json

router
  .route("/")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        next(error(404, "Username is taken!"))
        return;
      }
      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };
      users.push(user);
      res.json(users[users.length - 1]);
    } else next(error(404, "Insufficient data"))
  });

//GET - USERS/:id
//creating a route for each users using their id as a parameter

router
  .route("/:id")
  .get((req, res, next) => {
    // users.js is an array, we iterate over to see if the user id is equal to the request parameter.id
    const user = users.find((u) => u.id == req.params.id);
    console.log(user);
    //if we found the user - parse the data using res.json
    if (user) res.json(user);
    else next();
  })
  //modify an user using PATCH method
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    // The DELETE request route simply removes a resource.
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

module.exports = router;
