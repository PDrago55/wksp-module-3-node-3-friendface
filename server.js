"use strict";
const express = require("express");
const morgan = require("morgan");
const { users } = require("./data/users");
const PORT = process.env.PORT || 8000;

let currentUser = null;

const handleHome = (req, res) => {
  if (!currentUser) {
    res.redirect("/signin");
    return;
  }
  const friends = getFriends();
  console.log(friends);
  res.render("../pages/home", {
    user: currentUser,
    title: `Welcome to ${currentUser.name}'s home page!!!!`,
    friends: friends,
  });
  console.log(currentUser);
  console.log(friends)
};
const handleSignin = (req, res) => {
  if (currentUser) {
    res.redirect("/");
    return;
  }
  res.render("../pages/signin", {
    title: "THIS IS FRIEND FACE"
  });
};
const handleUser = (req, res) => {
  if (!currentUser) {
    res.redirect("/");
    return;
  }
  const id = req.params.id;
  res.send(`user id is ${id}`);
};
const handleName = (req, res) => {
  const firstName = req.query.firstName;
  currentUser = users.find(user => user.name === firstName);
  res.redirect(`${currentUser ? "/" : "/signin"}`);
  console.log(firstName);
  res.send(`name recieved.`);
};

const getFriends = () => {
  let threeFriends = [];
  currentUser.friends.forEach(friend => {
    users.forEach(user => {
      if (user.id === friend) {
        threeFriends.push(user);
      }
    });
  });
  return threeFriends;
};

express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHome)
  .get("/signin", handleSignin)
  .get("/user/:id", handleUser)
  .get("/getname", handleName)
  .get("*", (req, res) => {
    res.status(404);
    res.render("pages/fourOhFour", {
      title: "I got nothing",
      path: req.originalUrl
    });
  })
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
