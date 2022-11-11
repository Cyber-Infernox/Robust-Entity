const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

app.set("view engine", "ejs");

app.use(express.static("public"));

const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No Users Found" });
  }
  return res.status(200).json({ users });
};

app.get("/", getAllUser);

const signup = async (req, res, next) => {
  const { name, email, password } = new User(req.body);

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    res.status(500).json({ error: "There is a problem" });
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists! Login instead" });
  }

  const user = new User(req.body);

  const hashedPassword = bcrypt.hashSync(password);
  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    return res.status(500).json({ error: "There is a problem" });
  }

  res.status(201).json({ user });
};

app.get("/signup", (req, res) => {
  res.render("SignUp", { title: "Signup" });
});

app.post("/signup", signup);

app.get("/login", (req, res) => {
  res.render("LogIn", { title: "Login" });
});

app.post("/login", async (req, res, next) => {
  const { email, password } = new User(req.body);

  let newUser;
  try {
    newUser = await User.findOne({ email });
  } catch (error) {
    return res.status(500).json("Some problem!");
  }
  if (!newUser) {
    return res
      .status(404)
      .json({ message: "You don't have an account! Signup instead" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, newUser.password);

  if (isPasswordCorrect) {
    // const user = new User(req.body);
    // let obj;
    // try {
    //   obj = await User.findOne({ email });
    // } catch (error) {
    //   return res.status(500).json("Some problem!");
    // }
    // res.status(201).json({ obj });
    console.log("Login Successfull");
    return res.status(200).json({ message: "Login Successfull" });
  }
  console.log("Incorrect Password");
  return res.status(400).json({ message: "Incorrect Password" });
});
