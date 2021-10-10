const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/user");


router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })  //checking existence of the user
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "This account already exists!",
        });
      } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: req.body.password,
          mobileNumber: req.body.mobileNumber,
        });
        user.save()             //creating document in MongoDB
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: "User created",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
});



router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authentication Faild",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {    
        if (err) {
          return res.status(401).json({
            message: "Authentication Faild",
          });
        }
        if (result) {
          return res.status(200).json({
            message: "Authentication successful"
          });
        }
        res.status(401).json({
          message: "Authentication Faild",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
