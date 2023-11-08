require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const port = 3000;

const saltRounds = 10;
const app = express();

// const secret = process.env.SECRET_KEY;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://127.0.0.1:27017/Users");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String,
});
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.username,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SERCRET,
      callbackURL: "http://localhost:3000/auth/google/Secret",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/Secret",
  passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  })
);
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.get("/secrets", (req, res) => {
  User.find({ secret: { $ne: null } })
    .then((user) => {
      res.render("secrets.ejs", {
        secretUser: user,
      });
    })
    .catch((err) => {});
  // if (req.isAuthenticated()) {
  //   res.render("secrets.ejs");
  // } else {
  //   res.redirect("/login");
  // }
});
app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit.ejs");
  } else {
    res.redirect("/login");
  }
});
app.get("/logout", (req, res) => {
  req.logout((err) => {
    err ? console.log(err) : res.redirect("/");
  });
});
app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});
// bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
//   const newUser = new User({
//     email: req.body.username,
//     password: hash,
//   });
//   newUser
//     .save()
//     .then(() => {
//       res.render("secrets.ejs");
//     })
//     .catch(() => {
//       console.log("register failed");
//     });
// });

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
  // const userName = req.body.username;
  // const password = req.body.password;
  // User.findOne({ email: userName })
  //   .then((user) => {
  //     bcrypt.compare(password, user.password, function (err, result) {
  //       if (result === true) {
  //         res.render("secrets.ejs");
  //       }
  //     });
  //   })
  //   .catch(() => {
  //     console.log("Login failed");
  //   });
});
app.post("/submit", (req, res) => {
  const secretSubmit = req.body.secret;
  User.findById(req.user.id)
    .then((user) => {
      user.secret = secretSubmit;
      user
        .save()
        .then(() => {
          res.redirect("/secrets");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
