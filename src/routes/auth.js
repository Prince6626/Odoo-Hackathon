const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, password, emailId } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
    });

    // if (req.body.skills.length > 10) {
    //   throw new Error("Skills cannot be more than 10");
    // }
    await user.save();
    res.send("User added succsessfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);
    //bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create jwt token

      const token = await user.getJWT();

      //jwt.sign({ _id: user._id }, "DEV@Tinder$163971", {
      // expiresIn: "1d",
      // });
      // console.log(token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 2 * 3600000),
      });
      res.send("Login successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = authRouter;
