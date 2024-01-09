const express = require("express");
const comments = require("../data/comments");
const users = require("../data/users");
const error = require("../utilities/error");

const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.json(comments);
  })
  .post((req, res) => {
    if (req.body.id && req.body.userId && req.body.postId && req.body.body) {
      const comment = {
        id: req.body.id,
        userId: req.body.userId,
        postId: req.body.postId,
        body: req.body.body,
      };
      comments.push(comment);
      res.json(comments[comments.length - 1]);
    } else next(error(404, "Insufficient data"));
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const comment = comments.find((c) => c.id == req.params.id);
    if (comment) res.json(comment);
    else next();
  })
  .patch((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        for (const key in req.body) {
          comments[i][key] = req.body[key];
        }
        return true;
      }
    });
    if (comment) res.json(comment);
    else next();
  })
  .delete((req, res, next) => {
    const comment = comments.find((c, i) => {
      if (c.id == req.params.id) {
        comments.splice(i, 1);
        return true;
      }
    });
    if (comment) res.json(comment);
    else next();
  });

router.route("/?userId=<VALUE>").get((req, res, next) => {
  const user = users.find((u, i) => {
    if (u.id == req.query.userId) {
      console.log(user);
      res.json(comments);
    } else next();
  });
});

module.exports = router;
