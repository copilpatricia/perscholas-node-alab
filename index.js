const express = require("express");

//import the routes from the users and posts
const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments")
const error = require("./utilities/error")

const app = express();
const port = 3000;

//BEFORE ANY ROUTES!!- middlewares
//look for any data in the request.body
app.use(express.json());
//looks for any data in the url
app.use(express.urlencoded({ extended: true }));
//

// New logging middleware to help us keep track of
// requests during testing!
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
        ${time.toLocaleTimeString()}: Received a ${req.method} request to ${
      req.url
    }.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Valid API Keys.
const apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

app.use("/api", function (req, res, next) {
    var key = req.query["api-key"];
  
    // Check for the absence of a key.
    if (!key) next(error(400, "API Key Required")) 
  
    // Check for key validity.
    if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));
  
    // Valid key! Store it in req.key for route access.
    req.key = key;
    next();
  });

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/comments", comments);

// Adding some HATEOAS links.
app.get("/", (req, res) => {
    res.json({
      links: [
        {
          href: "/api",
          rel: "api",
          type: "GET",
        },
      ],
    });
  });

  // Adding some HATEOAS links.
app.get("/api", (req, res) => {
    res.json({
      links: [
        {
          href: "api/users",
          rel: "users",
          type: "GET",
        },
        {
          href: "api/users",
          rel: "users",
          type: "POST",
        },
        {
          href: "api/posts",
          rel: "posts",
          type: "GET",
        },
        {
          href: "api/posts",
          rel: "posts",
          type: "POST",
        },
      ],
    });
  });

// 404 NOT FOUND Middleware
app.use((req, res, next) => {
  next(error(404, "Resource not found!"))
});

// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
  });

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
