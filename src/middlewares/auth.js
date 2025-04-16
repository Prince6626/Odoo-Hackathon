const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("please login");
    }

    const decodedData = await jwt.verify(token, "DEV@Tinder$163971");
    const { _id } = decodedData;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found");
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(400).send("ERROR : " + err.message);
  }
};

module.exports = { userAuth };
