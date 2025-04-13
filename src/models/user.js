const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLendth: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLendth: 4,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLendth: 10,
      maxLength: 40,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLendth: 4,
    },
    age: {
      type: Number,
      min: 18,
    },
    about: {
      type: String,
      maxLength: 50
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Enter valid gender");
        }
      },
    },
    profileUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/020/911/747/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$163971", {
    expiresIn: "2d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordByUser, passwordHash);

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
