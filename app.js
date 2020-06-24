const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const cache = require("memory-cache");
const moment = require("moment");

const viewsPath = path.resolve(__dirname, "views");
const app = express();
const [home, newEntry] = ["home", "new entry"];
const title = ["Home", "New Entry"];

require("dotenv").config({ path: `${__dirname}/config/.env` });
const PORT = process.env.PORT || 3000;

app.set("views", viewsPath);
app.set("view engine", "ejs");

let entries = [];
app.locals.entries = entries;

// Logging
app.use(cookieParser("secret"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(logger("dev"));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Flash message
app.use(flash());

// External resource
app.use(express.static(`${__dirname}/views`));

// Caching memory
let memCache = new cache.Cache();
let cacheMiddleware = (duration) => {
  return (req, res, next) => {
    let key = "__express__" + req.originalUrl || req.url;
    let cacheContent = memCache.get(key);
    if (cacheContent) {
      res.send(cacheContent);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        memCache.put(key, body, duration * 20);
        res.sendResponse(body);
      };
      next();
    }
  };
};

app.use((req, res, next) => {
  res.locals.message = req.flash();
  next();
});

// Route
app.get("/", cacheMiddleware(25), (req, res) => {
  res.render("index", {
    pagename: home,
    title: title[0],
  });
});

app.get("/new-entry", cacheMiddleware(25), (req, res) => {
  res.render("new-entry", {
    pagename: newEntry,
    title: title[1],
  });
});

app.post("/new-entry", (req, res) => {
  if (!req.body.title || !req.body.content) {
    res.status(400);
    req.flash("error", "You must entries a title and a content!");
    res.redirect("/new-entry");
    return;
  }
  entries.push({
    title: req.body.title,
    content: req.body.content,
    published: moment().format("MMMM Do YYYY, h:mm:ss a"),
  });
  req.flash("success", "Guestbook has been inserted!");
  res.redirect("/");
});

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Error 404",
  });
});

app.listen(PORT, () => console.log(`Guestbook app started on port ${PORT}`));
